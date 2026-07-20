const Patient = require('./patient.model');
const OPD = require('../opd/opd.model');
const RegularCheckup = require('../regularCheckup/regularCheckup.model');
const TestBooking = require('../pathology/testBooking.model');
const Billing = require('../billing/billing.model');
const Return = require('../returns/return.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const sanitizePatientUpdateData = (data = {}) => {
  const sanitized = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === 'age' || key === 'marriageYear') {
      if (value === '' || value === null) return;
      sanitized[key] = Number(value);
      return;
    }

    if (key === 'city' && (value === '' || value === null)) return;

    if (key === 'address' && typeof value === 'string' && value.trim() === '') return;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '' && ['name', 'phone', 'gender', 'patientType'].includes(key)) return;
      sanitized[key] = trimmed;
      return;
    }

    sanitized[key] = value;
  });

  return sanitized;
};

const createPatient = async (data, createdBy) => {
  const patientId = await getNextId('patient', 'P');
  return Patient.create({ ...data, patientId, createdBy });
};

const buildPatientTypeFilter = (patientType) => {
  if (patientType === 'regular') {
    // Treat docs without the field as 'regular' (created before the field was added)
    return { $or: [{ patientType: 'regular' }, { patientType: { $exists: false } }, { patientType: null }] };
  }
  if (patientType) return { patientType };
  return null;
};

const getPatients = async (query = {}) => {
  const { search, city, page = 1, limit = 20, all, patientType } = query;

  if (all === 'true') {
    const filter = { isActive: true };
    const typeFilter = buildPatientTypeFilter(patientType);
    if (typeFilter) Object.assign(filter, typeFilter);
    return Patient.find(filter).select('name patientId phone patientType').sort('name');
  }

  const conditions = [];
  if (city) conditions.push({ city });
  const typeFilter = buildPatientTypeFilter(patientType);
  if (typeFilter) conditions.push(typeFilter);
  if (search) conditions.push({ $or: [
    { name: { $regex: search, $options: 'i' } },
    { phone: { $regex: search, $options: 'i' } },
    { patientId: { $regex: search, $options: 'i' } },
  ]});

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate('city', 'name state')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Patient.countDocuments(filter),
  ]);
  return { patients, total, page: Number(page), limit: Number(limit) };
};

const getPatientById = async (id) => {
  const patient = await Patient.findById(id).populate('city', 'name state').populate('createdBy', 'name');
  if (!patient) throw new ApiError(404, 'Patient not found');
  return patient;
};

const getPatientDetails = async (id) => {
  const patient = await Patient.findById(id).populate('city', 'name state').populate('createdBy', 'name');
  if (!patient) throw new ApiError(404, 'Patient not found');

  const [opds, regularCheckups, testBookings, bills, returns] = await Promise.all([
    OPD.find({ patient: id }).populate('doctor', 'name specialization').sort({ createdAt: -1 }),
    RegularCheckup.find({ patient: id }).populate('doctor', 'name specialization').sort({ createdAt: -1 }),
    TestBooking.find({ patient: id }).populate('tests.test', 'name code category').sort({ createdAt: -1 }),
    Billing.find({ patient: id }).sort({ createdAt: -1 }),
    Return.find({ patient: id }).sort({ createdAt: -1 }),
  ]);

  return { patient, opds, regularCheckups, testBookings, bills, returns };
};

const updatePatient = async (id, data) => {
  const sanitizedData = sanitizePatientUpdateData(data);
  const patient = await Patient.findByIdAndUpdate(id, sanitizedData, { new: true, runValidators: true });
  if (!patient) throw new ApiError(404, 'Patient not found');
  return patient;
};

const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(404, 'Patient not found');
  return true;
};

module.exports = { createPatient, getPatients, getPatientById, getPatientDetails, updatePatient, deletePatient };
