const RegularCheckup = require('./regularCheckup.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const createCheckup = async (data, createdBy) => {
  const checkupId = await getNextId('regularCheckup', 'RC');
  return RegularCheckup.create({ ...data, checkupId, createdBy });
};

const getCheckups = async (query = {}) => {
  const { search, patient, paymentStatus, page = 1, limit = 20 } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const [checkups, total] = await Promise.all([
    RegularCheckup.find(filter)
      .populate('patient', 'name patientId phone patientType')
      .populate('doctor', 'name specialization')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    RegularCheckup.countDocuments(filter),
  ]);
  return { checkups, total, page: Number(page), limit: Number(limit) };
};

const getCheckupById = async (id) => {
  const checkup = await RegularCheckup.findById(id)
    .populate('patient', 'name patientId phone age gender patientType')
    .populate('doctor', 'name specialization phone')
    .populate('createdBy', 'name');
  if (!checkup) throw new ApiError(404, 'Checkup record not found');
  return checkup;
};

const updateCheckup = async (id, data) => {
  const checkup = await RegularCheckup.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!checkup) throw new ApiError(404, 'Checkup record not found');
  return checkup;
};

const deleteCheckup = async (id) => {
  const checkup = await RegularCheckup.findByIdAndDelete(id);
  if (!checkup) throw new ApiError(404, 'Checkup record not found');
  return true;
};

const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [total, todayCount, feeApplicableCount, totalRevenue] = await Promise.all([
    RegularCheckup.countDocuments(),
    RegularCheckup.countDocuments({ createdAt: { $gte: today } }),
    RegularCheckup.countDocuments({ feeApplicable: true }),
    RegularCheckup.aggregate([{ $match: { feeApplicable: true } }, { $group: { _id: null, total: { $sum: '$fees' } } }]),
  ]);
  return { total, todayCount, feeApplicableCount, totalRevenue: totalRevenue[0]?.total || 0 };
};

module.exports = { createCheckup, getCheckups, getCheckupById, updateCheckup, deleteCheckup, getStats };
