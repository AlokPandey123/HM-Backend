const Billing = require('./billing.model');
const Medicine = require('../medicine/medicine.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const createBill = async (data, createdBy) => {
  const billId = await getNextId('billing', 'BILL');

  // Validate and deduct medicine stock
  for (const item of data.items) {
    if (item.itemType === 'medicine') {
      const medicine = await Medicine.findById(item.referenceId);
      if (!medicine) throw new ApiError(404, `Medicine not found: ${item.name}`);
      if (medicine.currentStock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${medicine.name}. Available: ${medicine.currentStock}`);
      }
      medicine.currentStock -= item.quantity;
      await medicine.save();
    }
  }

  const subtotal = data.items.reduce((sum, i) => sum + i.total, 0);
  const discount = data.discount || 0;
  const tax = data.tax || 0;
  const totalAmount = subtotal - discount + tax;

  return Billing.create({
    billId,
    customerType: data.customerType || 'patient',
    patient: data.patient || undefined,
    walkInCustomer: data.walkInCustomer,
    billType: data.billType || 'mixed',
    items: data.items,
    subtotal,
    discount,
    tax,
    totalAmount,
    paymentStatus: data.paymentStatus || 'pending',
    paymentMode: data.paymentMode || 'cash',
    amountPaid: data.amountPaid || 0,
    paymentReference: data.paymentReference,
    notes: data.notes,
    createdBy,
  });
};

const getBills = async (query = {}) => {
  const { patient, paymentStatus, billType, page = 1, limit = 20, startDate, endDate } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (billType) filter.billType = billType;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [bills, total] = await Promise.all([
    Billing.find(filter)
      .populate('patient', 'name patientId phone')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Billing.countDocuments(filter),
  ]);
  return { bills, total, page: Number(page), limit: Number(limit) };
};

const getBillById = async (id) => {
  const bill = await Billing.findById(id).populate('patient').populate('createdBy', 'name');
  if (!bill) throw new ApiError(404, 'Bill not found');
  return bill;
};

const updatePayment = async (id, data) => {
  const bill = await Billing.findByIdAndUpdate(id, data, { new: true });
  if (!bill) throw new ApiError(404, 'Bill not found');
  return bill;
};

const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalRevenue, todayRevenue, pendingAmount, totalBills] = await Promise.all([
    Billing.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Billing.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
    Billing.aggregate([{ $match: { paymentStatus: { $ne: 'paid' } } }, { $group: { _id: null, total: { $sum: { $subtract: ['$totalAmount', '$amountPaid'] } } } }]),
    Billing.countDocuments(),
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    todayRevenue: todayRevenue[0]?.total || 0,
    pendingAmount: pendingAmount[0]?.total || 0,
    totalBills,
  };
};

module.exports = { createBill, getBills, getBillById, updatePayment, getStats };
