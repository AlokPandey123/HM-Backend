const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Billing = require('../billing/billing.model');
const ApiError = require('../../utils/ApiError');

const createPaymentIntent = async (billId) => {
  const bill = await Billing.findById(billId).populate('patient', 'name email');
  if (!bill) throw new ApiError(404, 'Bill not found');

  const amountDue = bill.totalAmount - bill.amountPaid;
  if (amountDue <= 0) throw new ApiError(400, 'Bill is already fully paid');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountDue * 100),
    currency: 'inr',
    metadata: {
      billId: bill.billId,
      patientName: bill.patient?.name || 'Unknown',
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amountDue,
  };
};

const confirmPayment = async (billId, paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new ApiError(400, `Payment not successful: ${paymentIntent.status}`);
  }

  const amountPaid = paymentIntent.amount_received / 100;
  const bill = await Billing.findByIdAndUpdate(
    billId,
    {
      paymentStatus: 'paid',
      amountPaid,
      paymentMode: 'online',
      stripePaymentIntentId: paymentIntentId,
      paymentReference: paymentIntentId,
    },
    { new: true }
  );

  return bill;
};

module.exports = { createPaymentIntent, confirmPayment };
