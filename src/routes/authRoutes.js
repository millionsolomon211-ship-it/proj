const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const onsignup = require('../middlewares/signupMiddleware'); 
const passport = require('passport');

router.post('/signup', authLimiter, onsignup, authController.signup);

router.post('/login', authLimiter, authController.login);
router.get('/check-auth', verifyToken, authController.checkAuth);
router.post('/logout', authController.logout);




module.exports = router;