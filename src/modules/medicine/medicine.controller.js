const medicineService = require('./medicine.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.createMedicine(req.body, req.user._id);
  sendSuccess(res, medicine, 'Medicine created', 201);
});
const getMedicines = asyncHandler(async (req, res) => {
  const result = await medicineService.getMedicines(req.query);
  sendSuccess(res, result, 'Medicines retrieved');
});
const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await medicineService.getMedicineById(req.params.id);
  sendSuccess(res, medicine, 'Medicine retrieved');
});
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.updateMedicine(req.params.id, req.body);
  sendSuccess(res, medicine, 'Medicine updated');
});
const deleteMedicine = asyncHandler(async (req, res) => {
  await medicineService.deleteMedicine(req.params.id);
  sendSuccess(res, null, 'Medicine deleted');
});
const adjustStock = asyncHandler(async (req, res) => {
  const { quantity, type } = req.body;
  const medicine = await medicineService.adjustStock(req.params.id, quantity, type);
  sendSuccess(res, medicine, 'Stock adjusted');
});
const getStockStats = asyncHandler(async (req, res) => {
  const stats = await medicineService.getStockStats();
  sendSuccess(res, stats, 'Stats retrieved');
});

module.exports = { createMedicine, getMedicines, getMedicineById, updateMedicine, deleteMedicine, adjustStock, getStockStats };
