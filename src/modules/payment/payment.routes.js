const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);
router.post('/bills/:billId/payment-intent', paymentController.createPaymentIntent);
router.post('/bills/:billId/confirm', paymentController.confirmPayment);

module.exports = router;
