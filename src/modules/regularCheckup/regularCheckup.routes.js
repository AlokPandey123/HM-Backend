const express = require('express');
const router = express.Router();
const checkupController = require('./regularCheckup.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/stats', checkupController.getStats);
router.get('/', checkPermission('regular_checkup', 'view'), checkupController.getCheckups);
router.post('/', checkPermission('regular_checkup', 'create'), checkupController.createCheckup);
router.get('/:id', checkPermission('regular_checkup', 'view'), checkupController.getCheckupById);
router.put('/:id', checkPermission('regular_checkup', 'update'), checkupController.updateCheckup);
router.delete('/:id', checkPermission('regular_checkup', 'delete'), checkupController.deleteCheckup);

module.exports = router;
