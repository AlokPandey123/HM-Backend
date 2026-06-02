const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  originalPrice: { type: Number, required: true },
  returnPrice: { type: Number, required: true },
  deduction: { type: Number, required: true },
}, { _id: false });

const returnSchema = new mongoose.Schema({
  returnId: { type: String, unique: true },
  originalBill: { type: mongoose.Schema.Types.ObjectId, ref: 'Billing', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  items: [returnItemSchema],
  totalReturnAmount: { type: Number, required: true },
  totalDeduction: { type: Number, required: true },
  reason: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
