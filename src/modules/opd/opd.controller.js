const opdService = require('./opd.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createOPD = asyncHandler(async (req, res) => {
  const opd = await opdService.createOPD(req.body, req.user._id);
  sendSuccess(res, opd, 'OPD record created', 201);
});

const getOPDs = asyncHandler(async (req, res) => {
  const result = await opdService.getOPDs(req.query);
  sendSuccess(res, result, 'OPD records retrieved');
});

const getOPDById = asyncHandler(async (req, res) => {
  const opd = await opdService.getOPDById(req.params.id);
  sendSuccess(res, opd, 'OPD record retrieved');
});

const updateOPD = asyncHandler(async (req, res) => {
  const opd = await opdService.updateOPD(req.params.id, req.body);
  sendSuccess(res, opd, 'OPD record updated');
});

const deleteOPD = asyncHandler(async (req, res) => {
  await opdService.deleteOPD(req.params.id);
  sendSuccess(res, null, 'OPD record deleted');
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await opdService.getStats();
  sendSuccess(res, stats, 'Stats retrieved');
});

module.exports = { createOPD, getOPDs, getOPDById, updateOPD, deleteOPD, getStats };
