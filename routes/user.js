const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Handle signup route
router.post('/signup', async (req, res) => {

    console.log('i am here');
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            // If the email already exists, throw an error
            return res.status(409).json({ message: 'Email already exists!' });
        }

        // Store user data in the database
        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        });

        console.log('User created:', newUser);
        res.status(201).json({ message: 'Signup successful!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Signup failed!', error: error.message });
    }
});

module.exports = router;
