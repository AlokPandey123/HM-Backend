const OPD = require('./opd.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const createOPD = async (data, createdBy) => {
  const opdId = await getNextId('opd', 'OPD');
  return OPD.create({ ...data, opdId, createdBy });
};

const getOPDs = async (query = {}) => {
  const { search, patient, paymentStatus, page = 1, limit = 20 } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const [opds, total] = await Promise.all([
    OPD.find(filter)
      .populate('patient', 'name patientId phone')
      .populate('doctor', 'name specialization')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    OPD.countDocuments(filter),
  ]);
  return { opds, total, page: Number(page), limit: Number(limit) };
};

const getOPDById = async (id) => {
  const opd = await OPD.findById(id).populate('patient').populate('doctor', 'name specialization').populate('createdBy', 'name');
  if (!opd) throw new ApiError(404, 'OPD record not found');
  return opd;
};

const updateOPD = async (id, data) => {
  const opd = await OPD.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!opd) throw new ApiError(404, 'OPD record not found');
  return opd;
};

const deleteOPD = async (id) => {
  const opd = await OPD.findByIdAndDelete(id);
  if (!opd) throw new ApiError(404, 'OPD record not found');
  return true;
};

const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [total, todayCount, pendingPayment, totalRevenue] = await Promise.all([
    OPD.countDocuments(),
    OPD.countDocuments({ createdAt: { $gte: today } }),
    OPD.countDocuments({ paymentStatus: 'pending' }),
    OPD.aggregate([{ $group: { _id: null, total: { $sum: '$fees' } } }]),
  ]);
  return { total, todayCount, pendingPayment, totalRevenue: totalRevenue[0]?.total || 0 };
};

module.exports = { createOPD, getOPDs, getOPDById, updateOPD, deleteOPD, getStats };
