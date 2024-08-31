const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Handle signup route
router.post('/signup', userController.signup);

// Handle login route
router.post('/login', userController.login);

module.exports = router;
