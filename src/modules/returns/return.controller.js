const returnService = require('./return.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createReturn = asyncHandler(async (req, res) => {
  const ret = await returnService.createReturn(req.body, req.user._id);
  sendSuccess(res, ret, 'Return request created', 201);
});
const getReturns = asyncHandler(async (req, res) => {
  const result = await returnService.getReturns(req.query);
  sendSuccess(res, result, 'Returns retrieved');
});
const getReturnById = asyncHandler(async (req, res) => {
  const ret = await returnService.getReturnById(req.params.id);
  sendSuccess(res, ret, 'Return retrieved');
});
const approveReturn = asyncHandler(async (req, res) => {
  const ret = await returnService.approveReturn(req.params.id, req.user._id);
  sendSuccess(res, ret, 'Return approved');
});
const rejectReturn = asyncHandler(async (req, res) => {
  const ret = await returnService.rejectReturn(req.params.id, req.user._id);
  sendSuccess(res, ret, 'Return rejected');
});

module.exports = { createReturn, getReturns, getReturnById, approveReturn, rejectReturn };
