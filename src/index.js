const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. LOGGING
app.use(morgan('dev'));

// 2. RATE LIMITER (GLOBAL)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limiter globally
app.use(limiter);

// 3. CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173",
  "https://objective-flower-00277.pktriot.net"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 4. BODY PARSING & COOKIES
app.use(express.json());
app.use(cookieParser());

// 5. ROUTES
app.use('/api', authRoutes);

// 6. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});