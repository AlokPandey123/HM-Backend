const Return = require('./return.model');
const Billing = require('../billing/billing.model');
const Medicine = require('../medicine/medicine.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const RETURN_DEDUCTION_PERCENT = 20;

const createReturn = async (data, createdBy) => {
  const returnId = await getNextId('return', 'RET');

  const bill = await Billing.findById(data.originalBill).populate('patient');
  if (!bill) throw new ApiError(404, 'Original bill not found');

  const items = [];
  let totalReturnAmount = 0;
  let totalDeduction = 0;

  for (const item of data.items) {
    const medicine = await Medicine.findById(item.medicineId);
    if (!medicine) throw new ApiError(404, `Medicine not found: ${item.name}`);

    const originalPrice = item.originalPrice * item.quantity;
    const deductionAmount = (originalPrice * RETURN_DEDUCTION_PERCENT) / 100;
    const returnPrice = originalPrice - deductionAmount;

    items.push({
      medicine: medicine._id,
      name: medicine.name,
      quantity: item.quantity,
      originalPrice: item.originalPrice,
      returnPrice: returnPrice / item.quantity,
      deduction: deductionAmount / item.quantity,
    });

    totalDeduction += deductionAmount;
    totalReturnAmount += returnPrice;
  }

  const ret = await Return.create({
    returnId,
    originalBill: data.originalBill,
    patient: bill.patient._id || data.patient,
    items,
    totalReturnAmount,
    totalDeduction,
    reason: data.reason,
    notes: data.notes,
    createdBy,
  });

  return ret;
};

const approveReturn = async (id, userId) => {
  const ret = await Return.findById(id);
  if (!ret) throw new ApiError(404, 'Return not found');
  if (ret.status !== 'pending') throw new ApiError(400, 'Return already processed');

  // Add stock back
  for (const item of ret.items) {
    await Medicine.findByIdAndUpdate(item.medicine, { $inc: { currentStock: item.quantity } });
  }

  ret.status = 'approved';
  ret.processedBy = userId;
  ret.processedAt = new Date();
  await ret.save();
  return ret;
};

const rejectReturn = async (id, userId) => {
  const ret = await Return.findById(id);
  if (!ret) throw new ApiError(404, 'Return not found');
  if (ret.status !== 'pending') throw new ApiError(400, 'Return already processed');

  ret.status = 'rejected';
  ret.processedBy = userId;
  ret.processedAt = new Date();
  await ret.save();
  return ret;
};

const getReturns = async (query = {}) => {
  const { patient, status, page = 1, limit = 20 } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (status) filter.status = status;

  const [returns, total] = await Promise.all([
    Return.find(filter)
      .populate('patient', 'name patientId phone')
      .populate('originalBill', 'billId totalAmount')
      .populate('processedBy', 'name')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Return.countDocuments(filter),
  ]);
  return { returns, total, page: Number(page), limit: Number(limit) };
};

const getReturnById = async (id) => {
  const ret = await Return.findById(id)
    .populate('patient')
    .populate('originalBill')
    .populate('items.medicine', 'name genericName')
    .populate('processedBy', 'name')
    .populate('createdBy', 'name');
  if (!ret) throw new ApiError(404, 'Return not found');
  return ret;
};

module.exports = { createReturn, approveReturn, rejectReturn, getReturns, getReturnById };
