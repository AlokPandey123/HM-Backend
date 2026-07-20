const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, trim: true },
  phone: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

doctorSchema.index({ name: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
