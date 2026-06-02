const billingService = require('./billing.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createBill = asyncHandler(async (req, res) => {
  const bill = await billingService.createBill(req.body, req.user._id);
  sendSuccess(res, bill, 'Bill created', 201);
});
const getBills = asyncHandler(async (req, res) => {
  const result = await billingService.getBills(req.query);
  sendSuccess(res, result, 'Bills retrieved');
});
const getBillById = asyncHandler(async (req, res) => {
  const bill = await billingService.getBillById(req.params.id);
  sendSuccess(res, bill, 'Bill retrieved');
});
const updatePayment = asyncHandler(async (req, res) => {
  const bill = await billingService.updatePayment(req.params.id, req.body);
  sendSuccess(res, bill, 'Payment updated');
});
const getStats = asyncHandler(async (req, res) => {
  const stats = await billingService.getStats();
  sendSuccess(res, stats, 'Stats retrieved');
});

module.exports = { createBill, getBills, getBillById, updatePayment, getStats };
