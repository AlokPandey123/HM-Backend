const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  tests: [{
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
    result: { type: String, trim: true },
    remarks: { type: String, trim: true },
    completedAt: { type: Date },
  }],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
  paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'insurance', 'online'], default: 'cash' },
  amountPaid: { type: Number, default: 0 },
  bookedDate: { type: Date, default: Date.now },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('TestBooking', testBookingSchema);
