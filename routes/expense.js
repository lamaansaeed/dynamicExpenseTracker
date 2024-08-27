const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User')
const authenticateToken = require('../middleware/authMiddleware');
const sequelize = require('../database/database');
const  where  = require('sequelize');
// Get all expenses
router.get('/expense',authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.findAll({where: { userId: req.user.userId }});
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Add a new expense
router.post('/expense',authenticateToken, async (req, res) => {
    console.log('i am here 1')
    const { amount, description, category } = req.body;

    try {
        const expense = await Expense.create({ amount, description, category,userId: req.user.userId });
        await User.increment('totalExpense', {
            by: amount,
            where: { userId: req.user.userId }
        });
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

router.get('/expense/check-premium', authenticateToken, async (req, res) => {
    try {
        const premiumUser = await User.findOne({ where: { userId: req.user.userId } });

        if (!premiumUser) {
            return res.status(404).json({ error: 'No such user found' });
        }

        if (premiumUser.premium === false) {
            return res.status(403).json({ error: 'User does not have a premium membership' });
        }

        res.status(200).json(premiumUser);
    } catch (error) {
        console.error('Error checking premium status:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

router.get('/expense/leaderboard', async (req, res) => {
    try {
        // Fetch all users and their total expenses
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.json(leaderboard);
    } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

// Delete an expense
router.delete('/expense/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Expense.destroy({ where: { id, userId: req.user.userId } });

        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {3
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

module.exports = router;
