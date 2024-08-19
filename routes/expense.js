const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Get all expenses
router.get('/expense', async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Add a new expense
router.post('/expense', async (req, res) => {
    console.log('i am here 1')
    const { amount, description, category } = req.body;

    try {
        const expense = await Expense.create({ amount, description, category });
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Delete an expense
router.delete('/expense/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Expense.destroy({ where: { id } });

        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

module.exports = router;
