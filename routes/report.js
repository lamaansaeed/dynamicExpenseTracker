const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Income = require('../models/Income'); // Assuming you have these models
const Expense =require('../models/Expense');
// Endpoint to get report data based on type (daily, weekly, monthly, yearly)
router.get('/report/:type', async (req, res) => {
    const { type } = req.params;

    let startDate;
    const endDate = new Date();

    switch (type) {
        case 'daily':
            startDate = new Date(endDate);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'weekly':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'monthly':
            startDate = new Date(endDate);
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case 'yearly':
            startDate = new Date(endDate);
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        default:
            return res.status(400).json({ error: 'Invalid report type' });
    }

    try {
        const incomes = await Income.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        const expenses = await Expense.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
         console.log(incomes);
         console.log(expenses);
        res.json({ incomes, expenses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch report data',error });
    }
});

module.exports = router;
