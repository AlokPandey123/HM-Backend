const City = require('./city.model');
const ApiError = require('../../utils/ApiError');

const createCity = async (data, createdBy) => {
  const exists = await City.findOne({ name: data.name, state: data.state });
  if (exists) throw new ApiError(409, 'City already exists in this state');
  return City.create({ ...data, createdBy });
};

const getCities = async (query = {}) => {
  const { search, page = 1, limit = 20, all } = query;
  if (all === 'true') return City.find({ isActive: true }).sort('name');
  const filter = {};
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { state: { $regex: search, $options: 'i' } },
  ];
  const [cities, total] = await Promise.all([
    City.find(filter).populate('createdBy', 'name').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 }),
    City.countDocuments(filter),
  ]);
  return { cities, total, page: Number(page), limit: Number(limit) };
};

const getCityById = async (id) => {
  const city = await City.findById(id).populate('createdBy', 'name');
  if (!city) throw new ApiError(404, 'City not found');
  return city;
};

const updateCity = async (id, data) => {
  const city = await City.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!city) throw new ApiError(404, 'City not found');
  return city;
};

const deleteCity = async (id) => {
  const city = await City.findByIdAndDelete(id);
  if (!city) throw new ApiError(404, 'City not found');
  return true;
};

module.exports = { createCity, getCities, getCityById, updateCity, deleteCity };
