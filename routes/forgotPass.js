const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Configure Gmail transporter for testing
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail address
        pass: 'your-email-password'    // Replace with your Gmail password or App Password
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = bcrypt.hashSync(resetToken, 10);
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        // Save reset token and expiry to user
        user.resetToken = resetTokenHash;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // Send reset link via email
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            from: 'your-email@gmail.com', // Replace with your Gmail address
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset</p><p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`
        });

        res.json({ message: 'Reset link sent to your email', success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', success: false });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { resetToken: bcrypt.hashSync(token, 10), resetTokenExpires: { [Op.gt]: Date.now() } } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token', success: false });
        }

        // Hash the new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.json({ message: 'Password reset successful', success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', success: false });
    }
});

module.exports = router;
