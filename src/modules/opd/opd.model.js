const mongoose = require('mongoose');

const opdSchema = new mongoose.Schema({
  opdId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: String, required: true, trim: true },
  visitDate: { type: Date, default: Date.now },
  fees: { type: Number, required: true, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
  paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'insurance', 'online'], default: 'cash' },
  amountPaid: { type: Number, default: 0 },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('OPD', opdSchema);
