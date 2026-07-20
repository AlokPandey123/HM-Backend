const doctorService = require('./doctor.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body, req.user._id);
  sendSuccess(res, doctor, 'Doctor created', 201);
});

const getDoctors = asyncHandler(async (req, res) => {
  const result = await doctorService.getDoctors(req.query);
  sendSuccess(res, result, 'Doctors retrieved');
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  sendSuccess(res, doctor, 'Doctor retrieved');
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);
  sendSuccess(res, doctor, 'Doctor updated');
});

const deleteDoctor = asyncHandler(async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);
  sendSuccess(res, null, 'Doctor deleted');
});

module.exports = { createDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor };
