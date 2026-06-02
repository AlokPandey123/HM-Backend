const express = require('express');
const router = express.Router();
const returnController = require('./return.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/', checkPermission('returns', 'view'), returnController.getReturns);
router.post('/', checkPermission('returns', 'create'), returnController.createReturn);
router.get('/:id', checkPermission('returns', 'view'), returnController.getReturnById);
router.post('/:id/approve', checkPermission('returns', 'update'), returnController.approveReturn);
router.post('/:id/reject', checkPermission('returns', 'update'), returnController.rejectReturn);

module.exports = router;
