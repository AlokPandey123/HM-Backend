const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  sendSuccess(res, user, 'Profile retrieved');
});

const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
});

module.exports = { login, getProfile, logout };
