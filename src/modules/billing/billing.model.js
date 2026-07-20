const mongoose = require('mongoose');

const billingItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['opd', 'test', 'medicine'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: true });

const billingSchema = new mongoose.Schema({
  billId: { type: String, unique: true },
  customerType: { type: String, enum: ['patient', 'walk-in'], default: 'patient' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  walkInCustomer: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  billType: { type: String, enum: ['opd', 'pathology', 'medicine', 'mixed'], default: 'mixed' },
  items: [billingItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'refunded'], default: 'pending' },
  paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'insurance', 'online'], default: 'cash' },
  amountPaid: { type: Number, default: 0 },
  paymentReference: { type: String, trim: true },
  stripePaymentIntentId: { type: String },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
