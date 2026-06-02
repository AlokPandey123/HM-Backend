const Test = require('./test.model');
const TestBooking = require('./testBooking.model');
const { getNextId } = require('../../utils/counter');
const ApiError = require('../../utils/ApiError');

// Tests
const createTest = async (data, createdBy) => {
  const exists = await Test.findOne({ code: data.code.toUpperCase() });
  if (exists) throw new ApiError(409, 'Test code already exists');
  return Test.create({ ...data, createdBy });
};

const getTests = async (query = {}) => {
  const { search, category, page = 1, limit = 20, all } = query;
  if (all === 'true') return Test.find({ isActive: true }).sort('name');
  const filter = {};
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { code: { $regex: search, $options: 'i' } },
  ];
  const [tests, total] = await Promise.all([
    Test.find(filter).populate('createdBy', 'name').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 }),
    Test.countDocuments(filter),
  ]);
  return { tests, total, page: Number(page), limit: Number(limit) };
};

const getTestById = async (id) => {
  const test = await Test.findById(id);
  if (!test) throw new ApiError(404, 'Test not found');
  return test;
};

const updateTest = async (id, data) => {
  const test = await Test.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!test) throw new ApiError(404, 'Test not found');
  return test;
};

const deleteTest = async (id) => {
  const test = await Test.findByIdAndDelete(id);
  if (!test) throw new ApiError(404, 'Test not found');
  return true;
};

// Bookings
const createBooking = async (data, createdBy) => {
  const bookingId = await getNextId('testBooking', 'TB');
  const tests = await Test.find({ _id: { $in: data.testIds } });
  if (tests.length !== data.testIds.length) throw new ApiError(400, 'One or more tests not found');

  const testItems = tests.map(t => ({ test: t._id, price: t.price, status: 'pending' }));
  const totalAmount = testItems.reduce((sum, t) => sum + t.price, 0);
  const discount = data.discount || 0;
  const netAmount = totalAmount - discount;

  return TestBooking.create({
    bookingId,
    patient: data.patient,
    tests: testItems,
    totalAmount,
    discount,
    netAmount,
    paymentStatus: data.paymentStatus || 'pending',
    paymentMode: data.paymentMode || 'cash',
    amountPaid: data.amountPaid || 0,
    notes: data.notes,
    createdBy,
  });
};

const getBookings = async (query = {}) => {
  const { patient, paymentStatus, status, page = 1, limit = 20 } = query;
  const filter = {};
  if (patient) filter.patient = patient;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const [bookings, total] = await Promise.all([
    TestBooking.find(filter)
      .populate('patient', 'name patientId phone')
      .populate('tests.test', 'name code category')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    TestBooking.countDocuments(filter),
  ]);
  return { bookings, total, page: Number(page), limit: Number(limit) };
};

const getBookingById = async (id) => {
  const booking = await TestBooking.findById(id)
    .populate('patient')
    .populate('tests.test')
    .populate('createdBy', 'name');
  if (!booking) throw new ApiError(404, 'Booking not found');
  return booking;
};

const updateTestResult = async (bookingId, testId, result, remarks) => {
  const booking = await TestBooking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const testItem = booking.tests.id(testId);
  if (!testItem) throw new ApiError(404, 'Test item not found');

  testItem.result = result;
  testItem.remarks = remarks;
  testItem.status = 'completed';
  testItem.completedAt = new Date();

  await booking.save();
  return booking;
};

const updateBooking = async (id, data) => {
  const booking = await TestBooking.findByIdAndUpdate(id, data, { new: true });
  if (!booking) throw new ApiError(404, 'Booking not found');
  return booking;
};

module.exports = { createTest, getTests, getTestById, updateTest, deleteTest, createBooking, getBookings, getBookingById, updateTestResult, updateBooking };
