const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/stats', billingController.getStats);
router.get('/', checkPermission('billing', 'view'), billingController.getBills);
router.post('/', checkPermission('billing', 'create'), billingController.createBill);
router.get('/:id', checkPermission('billing', 'view'), billingController.getBillById);
router.put('/:id/payment', checkPermission('billing', 'update'), billingController.updatePayment);

module.exports = router;
