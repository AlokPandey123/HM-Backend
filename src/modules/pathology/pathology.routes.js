const express = require('express');
const router = express.Router();
const pathologyController = require('./pathology.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);

// Test management
router.get('/tests', checkPermission('pathology', 'view'), pathologyController.getTests);
router.post('/tests', checkPermission('pathology', 'create'), pathologyController.createTest);
router.get('/tests/:id', checkPermission('pathology', 'view'), pathologyController.getTestById);
router.put('/tests/:id', checkPermission('pathology', 'update'), pathologyController.updateTest);
router.delete('/tests/:id', checkPermission('pathology', 'delete'), pathologyController.deleteTest);

// Test bookings
router.get('/bookings', checkPermission('pathology', 'view'), pathologyController.getBookings);
router.post('/bookings', checkPermission('pathology', 'create'), pathologyController.createBooking);
router.get('/bookings/:id', checkPermission('pathology', 'view'), pathologyController.getBookingById);
router.put('/bookings/:id', checkPermission('pathology', 'update'), pathologyController.updateBooking);
router.put('/bookings/:id/tests/:testItemId/result', checkPermission('pathology', 'update'), pathologyController.updateTestResult);

module.exports = router;
