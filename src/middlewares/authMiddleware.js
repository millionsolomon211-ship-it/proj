const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Extracted via cookie-parser

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: 'Invalid token' });
  }
};

module.exports = verifyToken;