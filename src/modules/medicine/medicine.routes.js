const express = require('express');
const router = express.Router();
const medicineController = require('./medicine.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/stats', medicineController.getStockStats);
router.get('/', checkPermission('medicine_stock', 'view'), medicineController.getMedicines);
router.post('/', checkPermission('medicine_stock', 'create'), medicineController.createMedicine);
router.get('/:id', checkPermission('medicine_stock', 'view'), medicineController.getMedicineById);
router.put('/:id', checkPermission('medicine_stock', 'update'), medicineController.updateMedicine);
router.delete('/:id', checkPermission('medicine_stock', 'delete'), medicineController.deleteMedicine);
router.post('/:id/stock', checkPermission('medicine_stock', 'update'), medicineController.adjustStock);

module.exports = router;
