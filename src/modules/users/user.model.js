const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MODULES = [
  'dashboard', 'cities', 'admin_users', 'patients',
  'opd', 'pathology', 'billing', 'medicine_stock', 'reports', 'returns',
  'doctors', 'regular_checkup',
];

const permissionSchema = new mongoose.Schema({
  module: { type: String, enum: MODULES, required: true },
  actions: [{ type: String, enum: ['view', 'create', 'update', 'delete'] }],
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['superadmin', 'admin', 'manager'], required: true },
  isActive: { type: Boolean, default: true },
  hospitalCity: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  permissions: [permissionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const MODULES_LIST = MODULES;
module.exports = mongoose.model('User', userSchema);
module.exports.MODULES = MODULES_LIST;
