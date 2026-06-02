const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

const createUser = async (data, createdBy) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ ...data, createdBy });
  return user;
};

const getUsers = async (query = {}) => {
  const { role, search, page = 1, limit = 20 } = query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate('hospitalCity', 'name state')
      .populate('createdBy', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return { users, total, page: Number(page), limit: Number(limit) };
};

const getUserById = async (id) => {
  const user = await User.findById(id).populate('hospitalCity', 'name state').populate('createdBy', 'name email');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateUser = async (id, data) => {
  if (data.email) {
    const exists = await User.findOne({ email: data.email, _id: { $ne: id } });
    if (exists) throw new ApiError(409, 'Email already in use');
  }
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updatePermissions = async (id, permissions) => {
  const user = await User.findByIdAndUpdate(
    id,
    { permissions },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const toggleStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'superadmin') throw new ApiError(403, 'Cannot deactivate superadmin');
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'superadmin') throw new ApiError(403, 'Cannot delete superadmin');
  await User.findByIdAndDelete(id);
  return true;
};

const resetPassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = { createUser, getUsers, getUserById, updateUser, updatePermissions, toggleStatus, deleteUser, resetPassword };
