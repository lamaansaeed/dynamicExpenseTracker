const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Order =require('../models/Order');
const authenticateToken = require('../middleware/authMiddleware');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();


// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/buy-premium',authenticateToken, async (req, res) => {
    try {
       // console.log(process.env.RAZORPAY_KEY_ID);
        const userId = req.user.userId; // Assuming you have user authentication middleware
        const payment_capture = 1;
        const amount = 50000; // Amount in paise (e.g., Rs. 500)
        const currency = 'INR';

        const options = {
            amount: amount,
            currency: currency,
            receipt: uuidv4(),
            payment_capture
        };

        const order = await razorpay.orders.create(options);

           

        // Save order in your database
        const trackOrder = await Order.create({
            id: uuidv4(),
            orderId: order.id,
            status: 'pending',
            userId: userId // Assuming a relationship between orders and users
        });
        console.log(trackOrder,"order saved in database");
     
        res.status(200).json({
            id: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in creating order');
    }
});
router.post('/verify-payment',authenticateToken, async (req, res) => {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment verified successfully
        const user = await User.findOne({ where: { userId: req.user.userId } });

        // Update user to premium
        user.premium = true;
        await user.save();

        // Update the order status and save payment ID
        const order = await Order.findOne({ where: { orderId: razorpay_order_id } });
        order.paymentId = razorpay_payment_id;
        order.status = 'completed';
        await order.save();

        const token = jwt.sign(
            { userId: user.userId, premium: user.premium },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Adjust expiration as needed
        );

        res.status(200).json({ success: true, token });
    } else {
        // Payment verification failed
        const order = await Order.findOne({ where: { orderId: razorpay_order_id } });
        order.status = 'failed';
        await order.save();

        res.status(400).json({ success: false });
    }
});


module.exports = router;
