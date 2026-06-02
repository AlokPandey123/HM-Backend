require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { sendError } = require('./utils/response');
const ApiError = require('./utils/ApiError');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const cityRoutes = require('./modules/cities/city.routes');
const patientRoutes = require('./modules/patients/patient.routes');
const opdRoutes = require('./modules/opd/opd.routes');
const pathologyRoutes = require('./modules/pathology/pathology.routes');
const medicineRoutes = require('./modules/medicine/medicine.routes');
const billingRoutes = require('./modules/billing/billing.routes');
const returnRoutes = require('./modules/returns/return.routes');
const reportRoutes = require('./modules/reports/report.routes');
const paymentRoutes = require('./modules/payment/payment.routes');

const app = express();

connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.DASHBOARD_URL || 'http://localhost:5174',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Strict limiter on auth only (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);

// General API limiter — only active in production
if (process.env.NODE_ENV === 'production') {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/opd', opdRoutes);
app.use('/api/pathology', pathologyRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => sendError(res, `Route ${req.originalUrl} not found`, 404));

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return sendError(res, 'Validation error', 400, errors);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists`, 409);
  }
  if (err.isOperational) return sendError(res, err.message, err.statusCode, err.errors);

  console.error('Unhandled error:', err);
  sendError(res, 'Internal server error', 500);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HMS Backend running on port ${PORT}`));
