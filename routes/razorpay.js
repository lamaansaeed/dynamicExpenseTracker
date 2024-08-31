const express = require('express');
const router = express.Router();
const razorpayController = require('../controller/razorpayController');
const authenticateToken = require('../middleware/authMiddleware');

// Route to handle buying premium
router.post('/buy-premium', authenticateToken, razorpayController.buyPremium);

// Route to handle payment verification
router.post('/verify-payment', authenticateToken, razorpayController.verifyPayment);

module.exports = router;