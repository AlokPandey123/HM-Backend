const paymentService = require('./payment.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createPaymentIntent = asyncHandler(async (req, res) => {
  const result = await paymentService.createPaymentIntent(req.params.billId);
  sendSuccess(res, result, 'Payment intent created');
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  const bill = await paymentService.confirmPayment(req.params.billId, paymentIntentId);
  sendSuccess(res, bill, 'Payment confirmed');
});

module.exports = { createPaymentIntent, confirmPayment };
