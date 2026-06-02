require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { getNextId, Counter } = require('../utils/counter');
const User = require('../modules/users/user.model');
const City = require('../modules/cities/city.model');
const Patient = require('../modules/patients/patient.model');
const OPD = require('../modules/opd/opd.model');
const Test = require('../modules/pathology/test.model');
const TestBooking = require('../modules/pathology/testBooking.model');
const Medicine = require('../modules/medicine/medicine.model');
const Billing = require('../modules/billing/billing.model');
const Return = require('../modules/returns/return.model');

// ─── Static Data ──────────────────────────────────────────────────────────────

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Chandigarh', state: 'Punjab' },
];

const USERS = [
  { name: 'Dr. Ananya Singh',  email: 'admin1@hms.com',    password: 'Admin@123',   phone: '9800000001', role: 'admin'   },
  { name: 'Dr. Rohan Mehta',   email: 'admin2@hms.com',    password: 'Admin@123',   phone: '9800000002', role: 'admin'   },
  { name: 'Dr. Neha Gupta',    email: 'admin3@hms.com',    password: 'Admin@123',   phone: '9800000003', role: 'admin'   },
  { name: 'Priya Kapoor',      email: 'manager1@hms.com',  password: 'Manager@123', phone: '9800000004', role: 'manager' },
  { name: 'Karan Joshi',       email: 'manager2@hms.com',  password: 'Manager@123', phone: '9800000005', role: 'manager' },
  { name: 'Ritu Sharma',       email: 'manager3@hms.com',  password: 'Manager@123', phone: '9800000006', role: 'manager' },
  { name: 'Suresh Nair',       email: 'manager4@hms.com',  password: 'Manager@123', phone: '9800000007', role: 'manager' },
  { name: 'Vivek Patel',       email: 'manager5@hms.com',  password: 'Manager@123', phone: '9800000008', role: 'manager' },
];

const PATIENTS = [
  { name: 'Rahul Sharma',       age: 35, gender: 'male',   phone: '9876500001', address: '12 MG Road',         bloodGroup: 'A+'  },
  { name: 'Priya Patel',        age: 28, gender: 'female', phone: '9876500002', address: '45 Park Street',      bloodGroup: 'B+'  },
  { name: 'Amit Kumar',         age: 45, gender: 'male',   phone: '9876500003', address: '78 Civil Lines',      bloodGroup: 'O+'  },
  { name: 'Sunita Gupta',       age: 52, gender: 'female', phone: '9876500004', address: '23 Nehru Nagar',      bloodGroup: 'AB+' },
  { name: 'Vijay Singh',        age: 38, gender: 'male',   phone: '9876500005', address: '56 Gandhi Road',      bloodGroup: 'A-'  },
  { name: 'Rekha Mehta',        age: 31, gender: 'female', phone: '9876500006', address: '89 Lal Bagh',         bloodGroup: 'B-'  },
  { name: 'Rajesh Joshi',       age: 62, gender: 'male',   phone: '9876500007', address: '34 Shastri Nagar',    bloodGroup: 'O-'  },
  { name: 'Anita Nair',         age: 24, gender: 'female', phone: '9876500008', address: '67 Patel Colony',     bloodGroup: 'AB-' },
  { name: 'Suresh Verma',       age: 47, gender: 'male',   phone: '9876500009', address: '11 Sadar Bazar',      bloodGroup: 'A+'  },
  { name: 'Meena Rao',          age: 39, gender: 'female', phone: '9876500010', address: '44 Rajendra Nagar',   bloodGroup: 'B+'  },
  { name: 'Deepak Tiwari',      age: 55, gender: 'male',   phone: '9876500011', address: '77 Sector 12',        bloodGroup: 'O+'  },
  { name: 'Kavita Mishra',      age: 33, gender: 'female', phone: '9876500012', address: '22 DLF Colony',       bloodGroup: 'AB+' },
  { name: 'Arun Chauhan',       age: 41, gender: 'male',   phone: '9876500013', address: '55 Indira Nagar',     bloodGroup: 'A+'  },
  { name: 'Pooja Dubey',        age: 27, gender: 'female', phone: '9876500014', address: '88 Ram Nagar',        bloodGroup: 'B+'  },
  { name: 'Manoj Yadav',        age: 49, gender: 'male',   phone: '9876500015', address: '33 Karol Bagh',       bloodGroup: 'O+'  },
  { name: 'Seema Reddy',        age: 36, gender: 'female', phone: '9876500016', address: '66 Ashok Vihar',      bloodGroup: 'A-'  },
  { name: 'Ravi Shukla',        age: 58, gender: 'male',   phone: '9876500017', address: '99 Vasant Kunj',      bloodGroup: 'B-'  },
  { name: 'Nisha Srivastava',   age: 43, gender: 'female', phone: '9876500018', address: '14 Rohini',           bloodGroup: 'O-'  },
  { name: 'Arjun Iyer',         age: 32, gender: 'male',   phone: '9876500019', address: '47 Malviya Nagar',    bloodGroup: 'AB+' },
  { name: 'Lakshmi Bhat',       age: 61, gender: 'female', phone: '9876500020', address: '80 Saket',            bloodGroup: 'A+'  },
  { name: 'Sanjay Agarwal',     age: 44, gender: 'male',   phone: '9876500021', address: '25 Lajpat Nagar',     bloodGroup: 'B+'  },
  { name: 'Deepa Choudhary',    age: 29, gender: 'female', phone: '9876500022', address: '58 Green Park',       bloodGroup: 'O+'  },
  { name: 'Nitin Pillai',       age: 37, gender: 'male',   phone: '9876500023', address: '91 Hauz Khas',        bloodGroup: 'AB-' },
  { name: 'Usha Menon',         age: 54, gender: 'female', phone: '9876500024', address: '16 Kalkaji',          bloodGroup: 'A-'  },
  { name: 'Rohit Bajaj',        age: 26, gender: 'male',   phone: '9876500025', address: '49 Tilak Nagar',      bloodGroup: 'B+'  },
  { name: 'Geeta Malhotra',     age: 48, gender: 'female', phone: '9876500026', address: '82 Janakpuri',        bloodGroup: 'O+'  },
  { name: 'Anil Kapoor',        age: 67, gender: 'male',   phone: '9876500027', address: '27 Dwarka',           bloodGroup: 'AB+' },
  { name: 'Asha Trivedi',       age: 34, gender: 'female', phone: '9876500028', address: '60 Paschim Vihar',    bloodGroup: 'A+'  },
  { name: 'Pradeep Banerjee',   age: 53, gender: 'male',   phone: '9876500029', address: '93 Uttam Nagar',      bloodGroup: 'B-'  },
  { name: 'Suman Das',          age: 40, gender: 'female', phone: '9876500030', address: '18 Pitampura',        bloodGroup: 'O-'  },
  { name: 'Naveen Krishnan',    age: 31, gender: 'male',   phone: '9876500031', address: '51 Model Town',       bloodGroup: 'A+'  },
  { name: 'Radha Saxena',       age: 56, gender: 'female', phone: '9876500032', address: '84 Civil Lines',      bloodGroup: 'B+'  },
  { name: 'Ankit Pandey',       age: 22, gender: 'male',   phone: '9876500033', address: '29 Kamla Nagar',      bloodGroup: 'O+'  },
  { name: 'Divya Bose',         age: 45, gender: 'female', phone: '9876500034', address: '62 Shyam Nagar',      bloodGroup: 'AB+' },
  { name: 'Vivek Chandra',      age: 59, gender: 'male',   phone: '9876500035', address: '95 Rajouri Garden',   bloodGroup: 'A-'  },
  { name: 'Pallavi Deshpande',  age: 38, gender: 'female', phone: '9876500036', address: '20 Tagore Garden',    bloodGroup: 'B+'  },
  { name: 'Pankaj Jain',        age: 43, gender: 'male',   phone: '9876500037', address: '53 Subhash Nagar',    bloodGroup: 'O+'  },
  { name: 'Meera Goswami',      age: 32, gender: 'female', phone: '9876500038', address: '86 Kirti Nagar',      bloodGroup: 'A+'  },
  { name: 'Mahesh Rajan',       age: 51, gender: 'male',   phone: '9876500039', address: '31 Punjabi Bagh',     bloodGroup: 'AB-' },
  { name: 'Sheela Varma',       age: 47, gender: 'female', phone: '9876500040', address: '64 Shalimar Bagh',    bloodGroup: 'B-'  },
  { name: 'Ramesh Khanna',      age: 64, gender: 'male',   phone: '9876500041', address: '97 Ashok Nagar',      bloodGroup: 'O-'  },
  { name: 'Usha Dixit',         age: 25, gender: 'female', phone: '9876500042', address: '42 Saraswati Vihar',  bloodGroup: 'A+'  },
  { name: 'Sunil Mathur',       age: 39, gender: 'male',   phone: '9876500043', address: '75 Mangolpuri',       bloodGroup: 'B+'  },
  { name: 'Radha Bhatt',        age: 57, gender: 'female', phone: '9876500044', address: '10 Sultanpuri',       bloodGroup: 'O+'  },
  { name: 'Kiran Naik',         age: 33, gender: 'male',   phone: '9876500045', address: '43 Nangloi',          bloodGroup: 'AB+' },
  { name: 'Saroj Thakur',       age: 42, gender: 'female', phone: '9876500046', address: '76 Mundka',           bloodGroup: 'A-'  },
  { name: 'Dinesh Pawar',       age: 28, gender: 'male',   phone: '9876500047', address: '11 Shahdara',         bloodGroup: 'B+'  },
  { name: 'Lata Kaur',          age: 35, gender: 'female', phone: '9876500048', address: '44 Dilshad Garden',   bloodGroup: 'O+'  },
  { name: 'Ashok Bose',         age: 73, gender: 'male',   phone: '9876500049', address: '77 Krishna Nagar',    bloodGroup: 'A+'  },
  { name: 'Sunita Devi',        age: 46, gender: 'female', phone: '9876500050', address: '10 Laxmi Nagar',      bloodGroup: 'B+'  },
];

const EXTRA_MEDICINES = [
  { name: 'Atorvastatin 10mg',           genericName: 'Atorvastatin',              category: 'tablet',  manufacturer: 'Sun Pharma', batchNumber: 'BT009', expiryDate: new Date('2027-06-30'), mrp: 95,  purchasePrice: 60,  sellingPrice: 85,  currentStock: 220, minimumStock: 30, unit: 'strip'  },
  { name: 'Amlodipine 5mg',              genericName: 'Amlodipine',                category: 'tablet',  manufacturer: 'Cipla',      batchNumber: 'BT010', expiryDate: new Date('2027-03-31'), mrp: 55,  purchasePrice: 35,  sellingPrice: 48,  currentStock: 280, minimumStock: 40, unit: 'strip'  },
  { name: 'Losartan 50mg',               genericName: 'Losartan',                  category: 'tablet',  manufacturer: 'Dr. Reddy',  batchNumber: 'BT011', expiryDate: new Date('2027-09-30'), mrp: 130, purchasePrice: 85,  sellingPrice: 115, currentStock: 160, minimumStock: 25, unit: 'strip'  },
  { name: 'Pantoprazole 40mg',           genericName: 'Pantoprazole',              category: 'tablet',  manufacturer: 'Abbott',     batchNumber: 'BT012', expiryDate: new Date('2027-01-31'), mrp: 110, purchasePrice: 70,  sellingPrice: 98,  currentStock: 200, minimumStock: 30, unit: 'strip'  },
  { name: 'Doxycycline 100mg',           genericName: 'Doxycycline',               category: 'capsule', manufacturer: 'Cipla',      batchNumber: 'BT013', expiryDate: new Date('2026-11-30'), mrp: 75,  purchasePrice: 48,  sellingPrice: 65,  currentStock: 130, minimumStock: 20, unit: 'strip'  },
  { name: 'Montelukast 10mg',            genericName: 'Montelukast',               category: 'tablet',  manufacturer: 'Lupin',      batchNumber: 'BT014', expiryDate: new Date('2027-04-30'), mrp: 145, purchasePrice: 95,  sellingPrice: 128, currentStock: 170, minimumStock: 25, unit: 'strip'  },
  { name: 'Metronidazole 400mg',         genericName: 'Metronidazole',             category: 'tablet',  manufacturer: 'Sun Pharma', batchNumber: 'BT015', expiryDate: new Date('2026-08-31'), mrp: 40,  purchasePrice: 24,  sellingPrice: 35,  currentStock: 250, minimumStock: 35, unit: 'strip'  },
  { name: 'Levocetirizine 5mg',          genericName: 'Levocetirizine',            category: 'tablet',  manufacturer: 'Cipla',      batchNumber: 'BT016', expiryDate: new Date('2027-07-31'), mrp: 60,  purchasePrice: 38,  sellingPrice: 52,  currentStock: 300, minimumStock: 40, unit: 'strip'  },
  { name: 'Diclofenac 50mg',             genericName: 'Diclofenac',                category: 'tablet',  manufacturer: 'Abbott',     batchNumber: 'BT017', expiryDate: new Date('2026-10-31'), mrp: 28,  purchasePrice: 16,  sellingPrice: 24,  currentStock: 320, minimumStock: 45, unit: 'strip'  },
  { name: 'Clopidogrel 75mg',            genericName: 'Clopidogrel',               category: 'tablet',  manufacturer: 'Lupin',      batchNumber: 'BT018', expiryDate: new Date('2027-02-28'), mrp: 185, purchasePrice: 120, sellingPrice: 165, currentStock: 90,  minimumStock: 15, unit: 'strip'  },
  { name: 'Vitamin D3 60000 IU',         genericName: 'Cholecalciferol',           category: 'capsule', manufacturer: 'Cipla',      batchNumber: 'BT019', expiryDate: new Date('2027-08-31'), mrp: 55,  purchasePrice: 32,  sellingPrice: 48,  currentStock: 180, minimumStock: 25, unit: 'sachet' },
  { name: 'Calcium + Vitamin D3',        genericName: 'Calcium Carbonate',         category: 'tablet',  manufacturer: 'Abbott',     batchNumber: 'BT020', expiryDate: new Date('2027-05-31'), mrp: 120, purchasePrice: 78,  sellingPrice: 105, currentStock: 140, minimumStock: 20, unit: 'strip'  },
  { name: 'Iron + Folic Acid',           genericName: 'Ferrous Sulphate',          category: 'tablet',  manufacturer: 'Lupin',      batchNumber: 'BT021', expiryDate: new Date('2027-06-30'), mrp: 45,  purchasePrice: 28,  sellingPrice: 38,  currentStock: 260, minimumStock: 35, unit: 'strip'  },
  { name: 'Multivitamin Tablet',         genericName: 'Multivitamin',              category: 'tablet',  manufacturer: 'Dr. Reddy',  batchNumber: 'BT022', expiryDate: new Date('2027-03-31'), mrp: 85,  purchasePrice: 54,  sellingPrice: 75,  currentStock: 190, minimumStock: 30, unit: 'strip'  },
  { name: 'Salbutamol 4mg',              genericName: 'Salbutamol',                category: 'tablet',  manufacturer: 'Cipla',      batchNumber: 'BT023', expiryDate: new Date('2026-12-31'), mrp: 38,  purchasePrice: 22,  sellingPrice: 32,  currentStock: 120, minimumStock: 18, unit: 'strip'  },
  { name: 'Prednisolone 5mg',            genericName: 'Prednisolone',              category: 'tablet',  manufacturer: 'Sun Pharma', batchNumber: 'BT024', expiryDate: new Date('2026-09-30'), mrp: 30,  purchasePrice: 18,  sellingPrice: 26,  currentStock: 200, minimumStock: 30, unit: 'strip'  },
  { name: 'Cefixime 200mg',              genericName: 'Cefixime',                  category: 'capsule', manufacturer: 'Dr. Reddy',  batchNumber: 'BT025', expiryDate: new Date('2027-01-31'), mrp: 165, purchasePrice: 108, sellingPrice: 148, currentStock: 95,  minimumStock: 15, unit: 'strip'  },
  { name: 'Hydroxychloroquine 200mg',    genericName: 'Hydroxychloroquine',        category: 'tablet',  manufacturer: 'Cipla',      batchNumber: 'BT026', expiryDate: new Date('2027-04-30'), mrp: 75,  purchasePrice: 48,  sellingPrice: 65,  currentStock: 85,  minimumStock: 12, unit: 'strip'  },
  { name: 'Pantoprazole + Domperidone', genericName: 'Pantoprazole + Domperidone', category: 'capsule', manufacturer: 'Abbott',     batchNumber: 'BT027', expiryDate: new Date('2027-02-28'), mrp: 95,  purchasePrice: 60,  sellingPrice: 84,  currentStock: 155, minimumStock: 22, unit: 'strip'  },
  { name: 'Folic Acid 5mg',              genericName: 'Folic Acid',                category: 'tablet',  manufacturer: 'Lupin',      batchNumber: 'BT028', expiryDate: new Date('2027-07-31'), mrp: 22,  purchasePrice: 12,  sellingPrice: 18,  currentStock: 350, minimumStock: 50, unit: 'strip'  },
  { name: 'Ambroxol Syrup 100ml',        genericName: 'Ambroxol',                  category: 'syrup',   manufacturer: 'Sun Pharma', batchNumber: 'BT029', expiryDate: new Date('2026-11-30'), mrp: 65,  purchasePrice: 40,  sellingPrice: 58,  currentStock: 70,  minimumStock: 12, unit: 'bottle' },
  { name: 'Domperidone 10mg',            genericName: 'Domperidone',               category: 'tablet',  manufacturer: 'Cipla',      batchNumber: 'BT030', expiryDate: new Date('2027-06-30'), mrp: 48,  purchasePrice: 30,  sellingPrice: 42,  currentStock: 175, minimumStock: 25, unit: 'strip'  },
];

const EXTRA_TESTS = [
  { name: 'Malaria Antigen',         code: 'MALARIA', category: 'Serology',      price: 800,  processingTime: '2 hours',   sampleType: 'Blood',         normalRange: 'Negative'             },
  { name: 'HIV 1 & 2 Antibody',      code: 'HIV',     category: 'Serology',      price: 1200, processingTime: '4 hours',   sampleType: 'Blood',         normalRange: 'Non-reactive'         },
  { name: 'VDRL / RPR',              code: 'VDRL',    category: 'Serology',      price: 400,  processingTime: '3 hours',   sampleType: 'Blood',         normalRange: 'Non-reactive'         },
  { name: 'Stool Examination',       code: 'STOOL',   category: 'Microbiology',  price: 200,  processingTime: '2 hours',   sampleType: 'Stool',         normalRange: 'Normal'               },
  { name: 'ECG (Electrocardiogram)', code: 'ECG',     category: 'Cardiology',    price: 300,  processingTime: '30 minutes', sampleType: 'Physiological', normalRange: 'Normal sinus rhythm' },
];

const DOCTORS = [
  'Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Dr. Anil Kumar',
  'Dr. Sunita Gupta',  'Dr. Ramesh Nair', 'Dr. Kavita Joshi',
  'Dr. Vijay Singh',   'Dr. Meena Reddy',
];

const SYMPTOMS = [
  'Fever and chills',        'Headache and nausea',    'Chest pain',
  'Abdominal pain',          'Cough and cold',          'Back pain',
  'Joint pain',              'Skin rash',               'Dizziness',
  'Shortness of breath',     'Fatigue and weakness',    'Sore throat',
  'Eye irritation',          'Ear pain',                'High blood pressure',
  'Diabetes follow-up',      'Weight loss',             'Urinary problems',
  'Irregular heartbeat',     'Knee swelling',
];

const DIAGNOSES = [
  'Viral fever',                    'Migraine',                   'Angina pectoris',
  'Acute gastritis',                'Upper respiratory infection', 'Lumbar spondylosis',
  'Rheumatoid arthritis',           'Contact dermatitis',         'Benign vertigo',
  'Bronchial asthma',               'Iron deficiency anaemia',    'Acute pharyngitis',
  'Allergic conjunctivitis',        'Otitis media',               'Essential hypertension',
  'Type 2 diabetes mellitus',       'Hypothyroidism',             'Urinary tract infection',
  'Atrial fibrillation',            'Osteoarthritis knee',
];

const MODES = ['cash', 'card', 'upi', 'insurance', 'online'];
const STATUSES_BILL = ['paid', 'paid', 'paid', 'pending', 'partial'];
const STATUSES_OPD  = ['paid', 'paid', 'paid', 'pending', 'partial'];
const RETURN_REASONS = [
  'Medicine expired',                'Wrong medicine dispensed',
  'Patient allergic to medicine',    'Doctor changed prescription',
  'Duplicate dispensing',            'Medicine not required',
  'Patient discharged early',        'Medicine packaging damaged',
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const pick = (arr, i) => arr[i % arr.length];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seedAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── Step 0: Clear transactional data, keep superadmin + base medicines/tests
  console.log('\n[1/9] Clearing existing transactional data...');
  await Promise.all([
    Patient.deleteMany({}),
    OPD.deleteMany({}),
    TestBooking.deleteMany({}),
    Billing.deleteMany({}),
    Return.deleteMany({}),
  ]);
  await Counter.deleteMany({ model: { $in: ['patient', 'opd', 'billing', 'return', 'testBooking'] } });
  console.log('      Done.');

  // ── Step 1: Cities
  console.log('[2/9] Seeding cities...');
  for (const c of CITIES) {
    await City.findOneAndUpdate({ name: c.name, state: c.state }, c, { upsert: true });
  }
  const allCities = await City.find({}).lean();
  console.log(`      ${allCities.length} cities ready.`);

  // ── Step 2: Users
  console.log('[3/9] Seeding users...');
  const superadmin = await User.findOne({ role: 'superadmin' }).lean();
  const createdBy = superadmin?._id || null;
  for (const u of USERS) {
    await User.findOneAndUpdate({ email: u.email }, { ...u, isActive: true, permissions: [] }, { upsert: true });
  }
  console.log(`      ${USERS.length} users ready.`);

  // ── Step 3: Medicines (add extra to bring total to ~30)
  console.log('[4/9] Seeding medicines...');
  for (const m of EXTRA_MEDICINES) {
    await Medicine.findOneAndUpdate(
      { name: m.name, batchNumber: m.batchNumber },
      { ...m, isActive: true, createdBy },
      { upsert: true }
    );
  }
  const allMeds = await Medicine.find({ isActive: true }).lean();
  console.log(`      ${allMeds.length} medicines ready.`);

  // ── Step 4: Tests (add extra to bring total to ~15)
  console.log('[5/9] Seeding pathology tests...');
  for (const t of EXTRA_TESTS) {
    await Test.findOneAndUpdate({ code: t.code }, { ...t, isActive: true, createdBy }, { upsert: true });
  }
  const allTests = await Test.find({ isActive: true }).lean();
  console.log(`      ${allTests.length} tests ready.`);

  // ── Step 5: Patients (50)
  console.log('[6/9] Seeding 50 patients...');
  const patients = [];
  for (let i = 0; i < PATIENTS.length; i++) {
    const pd = PATIENTS[i];
    const patientId = await getNextId('patient', 'P');
    const p = await Patient.create({
      patientId,
      ...pd,
      city: pick(allCities, i)._id,
      email: `patient${i + 1}@example.com`,
      emergencyContact: `987650${String(1000 + i).slice(1)}`,
      isActive: true,
      createdBy,
    });
    patients.push(p);
  }
  console.log(`      ${patients.length} patients created.`);

  // ── Step 6: OPD records (50)
  console.log('[7/9] Seeding 50 OPD records...');
  const OPD_FEES = [100, 150, 200, 250, 300, 350, 400, 500];
  const PRESCRIPTIONS = [
    'Tab Paracetamol 500mg 1-0-1 x 5 days',
    'Tab Amoxicillin 250mg 1-1-1 x 7 days',
    'Tab Cetirizine 10mg 0-0-1 x 5 days',
    'Tab Ibuprofen 400mg 1-0-1 x 3 days',
    'Tab Metformin 500mg 1-0-1 x 30 days',
    'Tab Azithromycin 500mg 1-0-0 x 3 days',
    'Tab Omeprazole 20mg 1-0-0 x 14 days',
    'Syrup Ondansetron 5ml TDS x 3 days',
    'Tab Diclofenac 50mg 0-1-0 x 5 days',
    'Tab Prednisolone 5mg 1-0-0 x 7 days, taper',
  ];
  for (let i = 0; i < 50; i++) {
    const fees = pick(OPD_FEES, i);
    const status = pick(STATUSES_OPD, i);
    const opdId = await getNextId('opd', 'OPD');
    await OPD.create({
      opdId,
      patient:       pick(patients, i)._id,
      doctor:        pick(DOCTORS, i),
      visitDate:     daysAgo(i * 2 + 1),
      symptoms:      pick(SYMPTOMS, i),
      diagnosis:     pick(DIAGNOSES, i),
      prescription:  pick(PRESCRIPTIONS, i),
      fees,
      paymentStatus: status,
      paymentMode:   pick(MODES, i),
      amountPaid:    status === 'paid' ? fees : status === 'partial' ? Math.floor(fees / 2) : 0,
      notes:         `Follow up in ${pick([7, 14, 30], i)} days.`,
      createdBy,
    });
  }
  console.log('      50 OPD records created.');

  // ── Step 7: Test Bookings (50)
  console.log('[8/9] Seeding 50 test bookings...');
  const TEST_STATUSES = ['completed', 'completed', 'completed', 'pending', 'processing'];
  for (let i = 0; i < 50; i++) {
    const bookingId = await getNextId('testBooking', 'TB');
    const t1 = allTests[i % allTests.length];
    const t2 = allTests[(i + 3) % allTests.length];
    const selectedTests = t1._id.toString() === t2._id.toString() ? [t1] : [t1, t2];
    const totalAmount = selectedTests.reduce((s, t) => s + t.price, 0);
    const discount = i % 5 === 0 ? 50 : 0;
    const netAmount = totalAmount - discount;
    const status = pick(STATUSES_BILL, i);
    await TestBooking.create({
      bookingId,
      patient:       pick(patients, i)._id,
      tests:         selectedTests.map(t => ({
        test:   t._id,
        price:  t.price,
        status: pick(TEST_STATUSES, i),
        result: pick(TEST_STATUSES, i) === 'completed' ? 'Within normal limits' : '',
      })),
      totalAmount,
      discount,
      netAmount,
      paymentStatus: status,
      paymentMode:   pick(MODES, i),
      amountPaid:    status === 'paid' ? netAmount : status === 'partial' ? Math.floor(netAmount / 2) : 0,
      bookedDate:    daysAgo(i * 1.5 + 1),
      createdBy,
    });
  }
  console.log('      50 test bookings created.');

  // ── Step 8: Bills — 30 medicine bills + 20 OPD/pathology bills
  console.log('[9/9] Seeding 50 bills + 25 returns...');
  const medicineBillsForReturns = [];

  for (let i = 0; i < 30; i++) {
    const billId = await getNextId('billing', 'BILL');
    const patient = pick(patients, i);
    const med1 = allMeds[i % allMeds.length];
    const med2 = allMeds[(i + 5) % allMeds.length];
    const items = [
      { itemType: 'medicine', referenceId: med1._id, name: med1.name, quantity: 2, unitPrice: med1.sellingPrice, discount: 0, tax: 0, total: 2 * med1.sellingPrice },
      { itemType: 'medicine', referenceId: med2._id, name: med2.name, quantity: 1, unitPrice: med2.sellingPrice, discount: 0, tax: 0, total: med2.sellingPrice },
    ];
    const subtotal = items.reduce((s, it) => s + it.total, 0);
    const discount = i % 4 === 0 ? 20 : 0;
    const totalAmount = subtotal - discount;
    const status = pick(STATUSES_BILL, i);
    const bill = await Billing.create({
      billId,
      patient:       patient._id,
      billType:      'medicine',
      items,
      subtotal,
      discount,
      tax:           0,
      totalAmount,
      paymentStatus: status,
      paymentMode:   pick(MODES, i),
      amountPaid:    status === 'paid' ? totalAmount : status === 'partial' ? Math.floor(totalAmount / 2) : 0,
      createdBy,
    });
    medicineBillsForReturns.push({ bill, patient, med: med1 });
  }

  const OPD_CONSULT_FEES = [200, 250, 300, 350, 400, 450, 500, 550, 600, 700];
  for (let i = 0; i < 20; i++) {
    const billId = await getNextId('billing', 'BILL');
    const patient = pick(patients, i + 30);
    const isOPD = i % 2 === 0;
    const unitPrice = isOPD ? pick(OPD_CONSULT_FEES, i) : pick(allTests, i).price;
    const itemName = isOPD ? `Consultation — ${pick(DOCTORS, i)}` : pick(allTests, i).name;
    const items = [{
      itemType:  isOPD ? 'opd' : 'test',
      name:      itemName,
      quantity:  1,
      unitPrice,
      discount:  0,
      tax:       0,
      total:     unitPrice,
    }];
    const status = pick(STATUSES_BILL, i);
    await Billing.create({
      billId,
      patient:       patient._id,
      billType:      isOPD ? 'opd' : 'pathology',
      items,
      subtotal:      unitPrice,
      discount:      0,
      tax:           0,
      totalAmount:   unitPrice,
      paymentStatus: status,
      paymentMode:   pick(MODES, i),
      amountPaid:    status === 'paid' ? unitPrice : status === 'partial' ? Math.floor(unitPrice / 2) : 0,
      createdBy,
    });
  }

  // ── Step 9: Returns (25, referencing medicine bills)
  const RETURN_STATUSES = ['approved', 'approved', 'approved', 'pending', 'rejected'];
  for (let i = 0; i < 25; i++) {
    const { bill, patient, med } = medicineBillsForReturns[i];
    const returnId = await getNextId('return', 'RET');
    const qty = 1;
    const originalPrice = med.sellingPrice;
    const returnPrice  = parseFloat((originalPrice * qty * 0.8).toFixed(2));
    const deduction    = parseFloat((originalPrice * qty * 0.2).toFixed(2));
    const status = pick(RETURN_STATUSES, i);
    await Return.create({
      returnId,
      originalBill:       bill._id,
      patient:            patient._id,
      items: [{
        medicine:      med._id,
        name:          med.name,
        quantity:      qty,
        originalPrice,
        returnPrice,
        deduction,
      }],
      totalReturnAmount:  returnPrice,
      totalDeduction:     deduction,
      reason:             pick(RETURN_REASONS, i),
      status,
      processedBy:        status !== 'pending' ? createdBy : undefined,
      processedAt:        status !== 'pending' ? new Date() : undefined,
      createdBy,
    });
  }
  console.log('      50 bills + 25 returns created.');

  await mongoose.disconnect();

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║              SEED COMPLETE                       ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Cities:       ${allCities.length.toString().padEnd(34)}║`);
  console.log(`║  Users:        ${(USERS.length + 1).toString().padEnd(34)}║`);
  console.log(`║  Medicines:    ${allMeds.length.toString().padEnd(34)}║`);
  console.log(`║  Tests:        ${allTests.length.toString().padEnd(34)}║`);
  console.log(`║  Patients:     50                                ║`);
  console.log(`║  OPD records:  50                                ║`);
  console.log(`║  Test Bookings:50                                ║`);
  console.log(`║  Bills:        50 (30 medicine + 20 OPD/path)   ║`);
  console.log(`║  Returns:      25                                ║`);
  console.log('╠══════════════════════════════════════════════════╣');
  console.log('║  Login credentials:                              ║');
  console.log('║  Superadmin: superadmin@hms.com / SuperAdmin@123 ║');
  console.log('║  Admin:      admin1@hms.com     / Admin@123      ║');
  console.log('║  Manager:    manager1@hms.com   / Manager@123    ║');
  console.log('╚══════════════════════════════════════════════════╝');
}

seedAll().catch(err => { console.error(err); process.exit(1); });
