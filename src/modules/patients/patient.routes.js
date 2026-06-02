const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/', checkPermission('patients', 'view'), patientController.getPatients);
router.post('/', checkPermission('patients', 'create'), patientController.createPatient);
router.get('/:id', checkPermission('patients', 'view'), patientController.getPatientById);
router.put('/:id', checkPermission('patients', 'update'), patientController.updatePatient);
router.delete('/:id', checkPermission('patients', 'delete'), patientController.deletePatient);

module.exports = router;
