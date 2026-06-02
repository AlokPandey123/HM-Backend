const pathologyService = require('./pathology.service');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/response');

// Tests
const createTest = asyncHandler(async (req, res) => {
  const test = await pathologyService.createTest(req.body, req.user._id);
  sendSuccess(res, test, 'Test created', 201);
});
const getTests = asyncHandler(async (req, res) => {
  const result = await pathologyService.getTests(req.query);
  sendSuccess(res, result, 'Tests retrieved');
});
const getTestById = asyncHandler(async (req, res) => {
  const test = await pathologyService.getTestById(req.params.id);
  sendSuccess(res, test, 'Test retrieved');
});
const updateTest = asyncHandler(async (req, res) => {
  const test = await pathologyService.updateTest(req.params.id, req.body);
  sendSuccess(res, test, 'Test updated');
});
const deleteTest = asyncHandler(async (req, res) => {
  await pathologyService.deleteTest(req.params.id);
  sendSuccess(res, null, 'Test deleted');
});

// Bookings
const createBooking = asyncHandler(async (req, res) => {
  const booking = await pathologyService.createBooking(req.body, req.user._id);
  sendSuccess(res, booking, 'Booking created', 201);
});
const getBookings = asyncHandler(async (req, res) => {
  const result = await pathologyService.getBookings(req.query);
  sendSuccess(res, result, 'Bookings retrieved');
});
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await pathologyService.getBookingById(req.params.id);
  sendSuccess(res, booking, 'Booking retrieved');
});
const updateTestResult = asyncHandler(async (req, res) => {
  const { result, remarks } = req.body;
  const booking = await pathologyService.updateTestResult(req.params.id, req.params.testItemId, result, remarks);
  sendSuccess(res, booking, 'Test result updated');
});
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await pathologyService.updateBooking(req.params.id, req.body);
  sendSuccess(res, booking, 'Booking updated');
});

module.exports = { createTest, getTests, getTestById, updateTest, deleteTest, createBooking, getBookings, getBookingById, updateTestResult, updateBooking };
