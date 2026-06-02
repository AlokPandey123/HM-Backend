const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorizeRoles } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);

router.get('/modules', userController.getModules);

router.get('/', checkPermission('admin_users', 'view'), userController.getUsers);
router.post('/', authorizeRoles('superadmin', 'admin'), checkPermission('admin_users', 'create'), userController.createUser);
router.get('/:id', checkPermission('admin_users', 'view'), userController.getUserById);
router.put('/:id', authorizeRoles('superadmin', 'admin'), checkPermission('admin_users', 'update'), userController.updateUser);
router.put('/:id/permissions', authorizeRoles('superadmin', 'admin'), userController.updatePermissions);
router.patch('/:id/toggle-status', authorizeRoles('superadmin', 'admin'), userController.toggleStatus);
router.delete('/:id', authorizeRoles('superadmin'), userController.deleteUser);
router.post('/:id/reset-password', authorizeRoles('superadmin', 'admin'), userController.resetPassword);

module.exports = router;
