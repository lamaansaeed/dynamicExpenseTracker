const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); // To compare hashed passwords
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware'); 
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
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        // Store user data in the database
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        console.log('User created:', newUser);
        res.status(201).json({ message: 'Signup successful!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Signup failed!', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        
        // Compare the password with the hashed password stored in the database
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // If passwords match, authentication is successful
            const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            return res.json({ message: 'Login successful', success: true ,token});
        } else {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred', success: false });
    }
});

module.exports = router;
