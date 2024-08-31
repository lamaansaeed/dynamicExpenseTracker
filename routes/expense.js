const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const expenseController = require('../controller/expenseController');

// Get all expenses
router.get('/expense', authenticateToken, expenseController.getExpenses);

// Add a new expense
router.post('/expense', authenticateToken, expenseController.addExpense);

// Check if user is a premium member
router.get('/expense/check-premium', authenticateToken, expenseController.checkPremiumStatus);

// Get leaderboard
router.get('/expense/leaderboard', expenseController.getLeaderboard);

// Delete an expense
router.delete('/expense/:id', authenticateToken, expenseController.deleteExpense);

module.exports = router;
