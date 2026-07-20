const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/', checkPermission('doctors', 'view'), doctorController.getDoctors);
router.post('/', checkPermission('doctors', 'create'), doctorController.createDoctor);
router.get('/:id', checkPermission('doctors', 'view'), doctorController.getDoctorById);
router.put('/:id', checkPermission('doctors', 'update'), doctorController.updateDoctor);
router.delete('/:id', checkPermission('doctors', 'delete'), doctorController.deleteDoctor);

module.exports = router;
