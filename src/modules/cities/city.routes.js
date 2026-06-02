const express = require('express');
const router = express.Router();
const cityController = require('./city.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.use(authenticate);
router.get('/', checkPermission('cities', 'view'), cityController.getCities);
router.post('/', checkPermission('cities', 'create'), cityController.createCity);
router.get('/:id', checkPermission('cities', 'view'), cityController.getCityById);
router.put('/:id', checkPermission('cities', 'update'), cityController.updateCity);
router.delete('/:id', checkPermission('cities', 'delete'), cityController.deleteCity);

module.exports = router;
