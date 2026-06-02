const patientService = require('./patient.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient(req.body, req.user._id);
  sendSuccess(res, patient, 'Patient created', 201);
});

const getPatients = asyncHandler(async (req, res) => {
  const result = await patientService.getPatients(req.query);
  sendSuccess(res, result, 'Patients retrieved');
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);
  sendSuccess(res, patient, 'Patient retrieved');
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  sendSuccess(res, patient, 'Patient updated');
});

const deletePatient = asyncHandler(async (req, res) => {
  await patientService.deletePatient(req.params.id);
  sendSuccess(res, null, 'Patient deleted');
});

module.exports = { createPatient, getPatients, getPatientById, updatePatient, deletePatient };
