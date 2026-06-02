const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const token = generateToken(user._id);
  const userData = user.toJSON();

  return { token, user: userData };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('hospitalCity', 'name state').populate('createdBy', 'name email');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

module.exports = { login, getProfile };
