const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../logger');
// Configure Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'khanshadabb54321@gmail.com', // Replace with your Gmail address
        pass: 'mhsobqkjkfpzrjkg'   // Replace with your Gmail password or App Password
    }
});

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Generate a reset token with the email embedded in it
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset link via email
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        await transporter.sendMail({
            to: user.email,
            from: 'your-email@gmail.com', // Replace with your Gmail address
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset</p><p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`
        });

        res.json({ message: 'Reset link sent to your email', success: true });
    } catch (error) {
        logger.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', success: false });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Decode the token to extract the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found', success: false });
        }

        // Hash the new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successful', success: true });
    } catch (error) {
        logger.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', success: false });
    }
};

exports.serveResetPasswordPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reset-password.html'));
};
