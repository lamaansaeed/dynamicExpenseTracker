const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/authMiddleware');
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
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
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
