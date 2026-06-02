const express = require('express');
const router = express.Router();
const opdController = require('./opd.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/stats', opdController.getStats);
router.get('/', checkPermission('opd', 'view'), opdController.getOPDs);
router.post('/', checkPermission('opd', 'create'), opdController.createOPD);
router.get('/:id', checkPermission('opd', 'view'), opdController.getOPDById);
router.put('/:id', checkPermission('opd', 'update'), opdController.updateOPD);
router.delete('/:id', checkPermission('opd', 'delete'), opdController.deleteOPD);

module.exports = router;
