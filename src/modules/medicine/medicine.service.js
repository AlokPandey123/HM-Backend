const Medicine = require('./medicine.model');
const ApiError = require('../../utils/ApiError');

const createMedicine = async (data, createdBy) => {
  return Medicine.create({ ...data, createdBy });
};

const getMedicines = async (query = {}) => {
  const { search, category, lowStock, page = 1, limit = 20, all } = query;
  if (all === 'true') return Medicine.find({ isActive: true, currentStock: { $gt: 0 } }).select('name genericName sellingPrice currentStock unit category').sort('name');

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (lowStock === 'true') filter.$expr = { $lte: ['$currentStock', '$minimumStock'] };
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { genericName: { $regex: search, $options: 'i' } },
    { batchNumber: { $regex: search, $options: 'i' } },
  ];

  const [medicines, total] = await Promise.all([
    Medicine.find(filter).populate('createdBy', 'name').skip((page - 1) * limit).limit(Number(limit)).sort({ name: 1 }),
    Medicine.countDocuments(filter),
  ]);
  return { medicines, total, page: Number(page), limit: Number(limit) };
};

const getMedicineById = async (id) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  return medicine;
};

const updateMedicine = async (id, data) => {
  const medicine = await Medicine.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  return medicine;
};

const deleteMedicine = async (id) => {
  const medicine = await Medicine.findByIdAndDelete(id);
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  return true;
};

const adjustStock = async (id, quantity, type = 'add') => {
  const medicine = await Medicine.findById(id);
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  if (type === 'add') {
    medicine.currentStock += quantity;
  } else {
    if (medicine.currentStock < quantity) throw new ApiError(400, `Insufficient stock for ${medicine.name}`);
    medicine.currentStock -= quantity;
  }
  await medicine.save();
  return medicine;
};

const getStockStats = async () => {
  const [total, lowStock, outOfStock, expiringSoon] = await Promise.all([
    Medicine.countDocuments({ isActive: true }),
    Medicine.countDocuments({ isActive: true, $expr: { $lte: ['$currentStock', '$minimumStock'] }, currentStock: { $gt: 0 } }),
    Medicine.countDocuments({ isActive: true, currentStock: 0 }),
    Medicine.countDocuments({
      isActive: true,
      expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    }),
  ]);
  return { total, lowStock, outOfStock, expiringSoon };
};

module.exports = { createMedicine, getMedicines, getMedicineById, updateMedicine, deleteMedicine, adjustStock, getStockStats };
