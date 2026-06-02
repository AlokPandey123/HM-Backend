const Patient = require('./patient.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

const createPatient = async (data, createdBy) => {
  const patientId = await getNextId('patient', 'P');
  return Patient.create({ ...data, patientId, createdBy });
};

const getPatients = async (query = {}) => {
  const { search, city, page = 1, limit = 20, all } = query;
  if (all === 'true') return Patient.find({ isActive: true }).select('name patientId phone').sort('name');
  const filter = {};
  if (city) filter.city = city;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { phone: { $regex: search, $options: 'i' } },
    { patientId: { $regex: search, $options: 'i' } },
  ];

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

const updatePatient = async (id, data) => {
  const patient = await Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!patient) throw new ApiError(404, 'Patient not found');
  return patient;
};

const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(404, 'Patient not found');
  return true;
};

module.exports = { createPatient, getPatients, getPatientById, updatePatient, deletePatient };
