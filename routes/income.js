const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const incomeController = require('../controller/incomeController');

// Get all expenses
router.get('/income', authenticateToken, incomeController.getIncomes);

// Add a new expense
router.post('/income', authenticateToken, incomeController.addIncome);

// Check if user is a premium member
router.get('/income/check-premium', authenticateToken, incomeController.checkPremiumStatus);

// Get leaderboard
router.get('/income/leaderboard', incomeController.getLeaderboard);

// Delete an income
router.delete('/income/:id', authenticateToken, incomeController.deleteIncome);

module.exports = router;
