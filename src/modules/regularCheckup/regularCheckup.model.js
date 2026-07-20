const mongoose = require('mongoose');

const regularCheckupSchema = new mongoose.Schema({
  checkupId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  visitDate: { type: Date, default: Date.now },
  notes: { type: String, trim: true },
  feeApplicable: { type: Boolean, default: false },
  fees: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
  paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'insurance', 'online'], default: 'cash' },
  amountPaid: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('RegularCheckup', regularCheckupSchema);
