const userService = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');
const User = require('./user.model');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.user._id);
  sendSuccess(res, user, 'User created successfully', 201);
});

const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  sendSuccess(res, result, 'Users retrieved');
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, user, 'User retrieved');
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, user, 'User updated');
});

const updatePermissions = asyncHandler(async (req, res) => {
  const user = await userService.updatePermissions(req.params.id, req.body.permissions);
  sendSuccess(res, user, 'Permissions updated');
});

const toggleStatus = asyncHandler(async (req, res) => {
  const user = await userService.toggleStatus(req.params.id);
  sendSuccess(res, user, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, null, 'User deleted');
});

const resetPassword = asyncHandler(async (req, res) => {
  await userService.resetPassword(req.params.id, req.body.newPassword);
  sendSuccess(res, null, 'Password reset successfully');
});

const getModules = asyncHandler(async (req, res) => {
  sendSuccess(res, { modules: User.MODULES }, 'Modules retrieved');
});

module.exports = { createUser, getUsers, getUserById, updateUser, updatePermissions, toggleStatus, deleteUser, resetPassword, getModules };
