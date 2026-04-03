const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.get('/check-auth', verifyToken, authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;