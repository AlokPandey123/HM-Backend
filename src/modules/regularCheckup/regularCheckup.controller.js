const checkupService = require('./regularCheckup.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createCheckup = asyncHandler(async (req, res) => {
  const checkup = await checkupService.createCheckup(req.body, req.user._id);
  sendSuccess(res, checkup, 'Checkup created', 201);
});

const getCheckups = asyncHandler(async (req, res) => {
  const result = await checkupService.getCheckups(req.query);
  sendSuccess(res, result, 'Checkups retrieved');
});

const getCheckupById = asyncHandler(async (req, res) => {
  const checkup = await checkupService.getCheckupById(req.params.id);
  sendSuccess(res, checkup, 'Checkup retrieved');
});

const updateCheckup = asyncHandler(async (req, res) => {
  const checkup = await checkupService.updateCheckup(req.params.id, req.body);
  sendSuccess(res, checkup, 'Checkup updated');
});

const deleteCheckup = asyncHandler(async (req, res) => {
  await checkupService.deleteCheckup(req.params.id);
  sendSuccess(res, null, 'Checkup deleted');
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await checkupService.getStats();
  sendSuccess(res, stats, 'Stats retrieved');
});

module.exports = { createCheckup, getCheckups, getCheckupById, updateCheckup, deleteCheckup, getStats };
