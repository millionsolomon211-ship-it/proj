const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // e.g., 'http://localhost:5173'
  credentials: true // Crucial for allowing cookies to be sent back and forth
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});