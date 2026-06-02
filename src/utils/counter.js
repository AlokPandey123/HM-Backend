const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  sequence: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

const getNextId = async (model, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { model },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}${String(counter.sequence).padStart(4, '0')}`;
};

module.exports = { Counter, getNextId };
