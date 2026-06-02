const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/dashboard', reportController.getDashboardStats);
router.get('/patient/:patientId', checkPermission('reports', 'view'), reportController.getPatientReport);
router.get('/tests', checkPermission('reports', 'view'), reportController.getTestReports);
router.get('/revenue', checkPermission('reports', 'view'), reportController.getRevenueReport);

module.exports = router;
