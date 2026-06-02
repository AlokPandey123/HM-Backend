const cityService = require('./city.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

const createCity = asyncHandler(async (req, res) => {
  const city = await cityService.createCity(req.body, req.user._id);
  sendSuccess(res, city, 'City created', 201);
});

const getCities = asyncHandler(async (req, res) => {
  const result = await cityService.getCities(req.query);
  sendSuccess(res, result, 'Cities retrieved');
});

const getCityById = asyncHandler(async (req, res) => {
  const city = await cityService.getCityById(req.params.id);
  sendSuccess(res, city, 'City retrieved');
});

const updateCity = asyncHandler(async (req, res) => {
  const city = await cityService.updateCity(req.params.id, req.body);
  sendSuccess(res, city, 'City updated');
});

const deleteCity = asyncHandler(async (req, res) => {
  await cityService.deleteCity(req.params.id);
  sendSuccess(res, null, 'City deleted');
});

module.exports = { createCity, getCities, getCityById, updateCity, deleteCity };
