const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const signup = async (req, res) => {
  const { full_Name, username, email, phone, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await userModel.findUserByIdentifier(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Username already in use' });
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Save to DB
    await userModel.createUser(full_Name, username, email, phone, passwordHash);


   const token = jwt.sign(
  { username: username, name: full_Name }, 
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

    res.cookie('token', token, {
      httpOnly: true, // Prevents XSS attacks (JS cannot read it)
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'lax', // Protects against CSRF
      maxAge: 3600000 // 1 hour in milliseconds
    });

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error during signup' });
  }
};














const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // 1. Find user by email, username, or phone
    const user = await userModel.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      {  username: user.username, name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send token in an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'lax', // Protects against CSRF
      maxAge: 3600000 // 1 hour in milliseconds
    });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const checkAuth = (req, res) => {
  // If the request makes it past authMiddleware, the user is authenticated
  res.status(200).json({ authenticated: true, user: req.user });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};


const googleCallback = (req, res) => {
    const user = req.user; // Set by passport

    const token = jwt.sign(
        { username: user.username, name: user.full_name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000
    });

    // Redirect back to your frontend dashboard
    res.redirect('http://localhost:5173/dashboard');
};

module.exports = { signup, login, checkAuth, logout };