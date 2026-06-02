require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../modules/users/user.model');
const City = require('../modules/cities/city.model');
const Medicine = require('../modules/medicine/medicine.model');
const Test = require('../modules/pathology/test.model');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Superadmin
  const existing = await User.findOne({ role: 'superadmin' });
  if (!existing) {
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@hms.com',
      password: 'SuperAdmin@123',
      phone: '9999999999',
      role: 'superadmin',
      isActive: true,
    });
    console.log('Superadmin created: superadmin@hms.com / SuperAdmin@123');
  } else {
    console.log('Superadmin already exists');
  }

  // Sample cities
  const cities = [
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
  ];
  for (const c of cities) {
    await City.findOneAndUpdate({ name: c.name, state: c.state }, c, { upsert: true });
  }
  console.log('Sample cities seeded');

  // Sample tests
  const tests = [
    { name: 'Complete Blood Count', code: 'CBC', category: 'Haematology', price: 350, processingTime: '4 hours', normalRange: 'WBC: 4-11 K/uL' },
    { name: 'Blood Sugar Fasting', code: 'BSF', category: 'Biochemistry', price: 120, processingTime: '2 hours', normalRange: '70-100 mg/dL' },
    { name: 'Blood Sugar Post Prandial', code: 'BSPP', category: 'Biochemistry', price: 120, processingTime: '2 hours', normalRange: '<140 mg/dL' },
    { name: 'HbA1c', code: 'HBA1C', category: 'Biochemistry', price: 450, processingTime: '6 hours', normalRange: '<5.7%' },
    { name: 'Lipid Profile', code: 'LP', category: 'Biochemistry', price: 550, processingTime: '6 hours', normalRange: 'Total: <200 mg/dL' },
    { name: 'Thyroid Profile', code: 'TFT', category: 'Endocrinology', price: 650, processingTime: '24 hours', normalRange: 'TSH: 0.4-4.0 mIU/L' },
    { name: 'Urine Routine', code: 'UR', category: 'Urine', price: 150, processingTime: '2 hours', sampleType: 'Urine', normalRange: 'Normal' },
    { name: 'Liver Function Test', code: 'LFT', category: 'Biochemistry', price: 700, processingTime: '6 hours', normalRange: 'AST: 10-40 U/L' },
    { name: 'Kidney Function Test', code: 'KFT', category: 'Biochemistry', price: 600, processingTime: '6 hours', normalRange: 'Creatinine: 0.7-1.3 mg/dL' },
    { name: 'Dengue NS1 Antigen', code: 'DENGUE', category: 'Serology', price: 900, processingTime: '4 hours', normalRange: 'Negative' },
  ];
  for (const t of tests) {
    await Test.findOneAndUpdate({ code: t.code }, t, { upsert: true });
  }
  console.log('Sample tests seeded');

  // Sample medicines
  const medicines = [
    { name: 'Paracetamol 500mg', genericName: 'Paracetamol', category: 'tablet', manufacturer: 'Cipla', batchNumber: 'BT001', expiryDate: new Date('2026-12-31'), mrp: 20, purchasePrice: 12, sellingPrice: 18, currentStock: 500, minimumStock: 50, unit: 'strip' },
    { name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'capsule', manufacturer: 'Sun Pharma', batchNumber: 'BT002', expiryDate: new Date('2026-09-30'), mrp: 85, purchasePrice: 55, sellingPrice: 75, currentStock: 200, minimumStock: 30, unit: 'strip' },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'capsule', manufacturer: 'Dr. Reddy', batchNumber: 'BT003', expiryDate: new Date('2026-06-30'), mrp: 45, purchasePrice: 28, sellingPrice: 40, currentStock: 300, minimumStock: 40, unit: 'strip' },
    { name: 'Azithromycin 500mg', genericName: 'Azithromycin', category: 'tablet', manufacturer: 'Cipla', batchNumber: 'BT004', expiryDate: new Date('2026-11-30'), mrp: 120, purchasePrice: 80, sellingPrice: 110, currentStock: 150, minimumStock: 20, unit: 'strip' },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'tablet', manufacturer: 'Lupin', batchNumber: 'BT005', expiryDate: new Date('2027-03-31'), mrp: 35, purchasePrice: 20, sellingPrice: 30, currentStock: 400, minimumStock: 50, unit: 'strip' },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'tablet', manufacturer: 'Abbott', batchNumber: 'BT006', expiryDate: new Date('2026-08-31'), mrp: 30, purchasePrice: 18, sellingPrice: 25, currentStock: 350, minimumStock: 40, unit: 'strip' },
    { name: 'Metformin 500mg', genericName: 'Metformin', category: 'tablet', manufacturer: 'Sun Pharma', batchNumber: 'BT007', expiryDate: new Date('2027-01-31'), mrp: 55, purchasePrice: 35, sellingPrice: 50, currentStock: 180, minimumStock: 30, unit: 'strip' },
    { name: 'Ondansetron Syrup', genericName: 'Ondansetron', category: 'syrup', manufacturer: 'Cipla', batchNumber: 'BT008', expiryDate: new Date('2026-10-31'), mrp: 95, purchasePrice: 60, sellingPrice: 85, currentStock: 80, minimumStock: 15, unit: 'bottle' },
  ];
  for (const m of medicines) {
    await Medicine.findOneAndUpdate({ name: m.name, batchNumber: m.batchNumber }, m, { upsert: true });
  }
  console.log('Sample medicines seeded');

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  console.log('Login: superadmin@hms.com / SuperAdmin@123');
}

seed().catch(err => { console.error(err); process.exit(1); });
