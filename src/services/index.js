require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g., 'http://localhost:5173'
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