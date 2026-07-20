const Patient = require('../patients/patient.model');
const TestBooking = require('../pathology/testBooking.model');
const OPD = require('../opd/opd.model');
const Billing = require('../billing/billing.model');
const Return = require('../returns/return.model');
const Medicine = require('../medicine/medicine.model');
const RegularCheckup = require('../regularCheckup/regularCheckup.model');
const ApiError = require('../../utils/ApiError');

const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalPatients, todayPatients,
    totalOPD, todayOPD,
    totalBills, todayRevenue,
    pendingTests, completedTests,
    lowStockCount,
    totalCheckups, todayCheckups, feeApplicableCheckups, checkupRevenue,
  ] = await Promise.all([
    Patient.countDocuments({ isActive: true }),
    Patient.countDocuments({ createdAt: { $gte: today } }),
    OPD.countDocuments(),
    OPD.countDocuments({ createdAt: { $gte: today } }),
    Billing.countDocuments(),
    Billing.aggregate([{ $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
    TestBooking.countDocuments({ 'tests.status': 'pending' }),
    TestBooking.countDocuments({ 'tests.status': 'completed' }),
    Medicine.countDocuments({ isActive: true, $expr: { $lte: ['$currentStock', '$minimumStock'] } }),
    RegularCheckup.countDocuments(),
    RegularCheckup.countDocuments({ createdAt: { $gte: today } }),
    RegularCheckup.countDocuments({ feeApplicable: true }),
    RegularCheckup.aggregate([{ $match: { feeApplicable: true } }, { $group: { _id: null, total: { $sum: '$fees' } } }]),
  ]);

  return {
    patients: { total: totalPatients, today: todayPatients },
    opd: { total: totalOPD, today: todayOPD },
    billing: { total: totalBills, todayRevenue: todayRevenue[0]?.total || 0 },
    tests: { pending: pendingTests, completed: completedTests },
    medicine: { lowStock: lowStockCount },
    regularCheckups: {
      total: totalCheckups,
      today: todayCheckups,
      feeApplicable: feeApplicableCheckups,
      totalRevenue: checkupRevenue[0]?.total || 0,
    },
  };
};

const getPatientReport = async (patientId) => {
  const patient = await Patient.findById(patientId).populate('city', 'name');
  if (!patient) throw new ApiError(404, 'Patient not found');

  const [opds, testBookings, bills, returns] = await Promise.all([
    OPD.find({ patient: patientId }).sort({ createdAt: -1 }),
    TestBooking.find({ patient: patientId }).populate('tests.test', 'name code category').sort({ createdAt: -1 }),
    Billing.find({ patient: patientId }).sort({ createdAt: -1 }),
    Return.find({ patient: patientId }).sort({ createdAt: -1 }),
  ]);

  return { patient, opds, testBookings, bills, returns };
};

const getTestReports = async (query = {}) => {
  const { patient, startDate, endDate, status, page = 1, limit = 20 } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (status) filter['tests.status'] = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [bookings, total] = await Promise.all([
    TestBooking.find(filter)
      .populate('patient', 'name patientId phone age gender')
      .populate('tests.test', 'name code category normalRange')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    TestBooking.countDocuments(filter),
  ]);
  return { bookings, total, page: Number(page), limit: Number(limit) };
};

const getRevenueReport = async (query = {}) => {
  const { startDate, endDate, groupBy = 'day' } = query;
  const matchFilter = {};
  if (startDate || endDate) {
    matchFilter.createdAt = {};
    if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
    if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
  }

  const dateFormat = groupBy === 'month' ? '%Y-%m' : groupBy === 'year' ? '%Y' : '%Y-%m-%d';
  const revenue = await Billing.aggregate([
    { $match: matchFilter },
    { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, total: { $sum: '$totalAmount' }, paid: { $sum: '$amountPaid' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return revenue;
};

module.exports = { getDashboardStats, getPatientReport, getTestReports, getRevenueReport };
