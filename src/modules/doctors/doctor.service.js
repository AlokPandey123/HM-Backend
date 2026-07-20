const Doctor = require('./doctor.model');
const ApiError = require('../../utils/ApiError');

const createDoctor = async (data, createdBy) => {
  return Doctor.create({ ...data, createdBy });
};

const getDoctors = async (query = {}) => {
  const { search, page = 1, limit = 20, all } = query;
  if (all === 'true') return Doctor.find({ isActive: true }).select('name specialization phone').sort('name');

  const filter = { isActive: true };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const [doctors, total] = await Promise.all([
    Doctor.find(filter)
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Doctor.countDocuments(filter),
  ]);
  return { doctors, total, page: Number(page), limit: Number(limit) };
};

const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

const updateDoctor = async (id, data) => {
  const doctor = await Doctor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return true;
};

module.exports = { createDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor };
