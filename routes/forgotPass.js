const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controller/forgotPassController');

// Handle forgot password route
router.post('/forgot-password', forgotPasswordController.forgotPassword);

// Handle reset password route
router.post('/resetting-password/:token', forgotPasswordController.resetPassword);

// Serve reset password page
router.get('/reset-password/:token', forgotPasswordController.serveResetPasswordPage);

module.exports = router;
