const Expense = require('../models/Expense');
const User = require('../models/User');
const sequelize = require('../database/database');
const logger = require('../logger');

exports.getExpenses = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId: req.user.userId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]  // Sorting by the most recent expenses
        });

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            expenses
        });
    } catch (error) {
        logger.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

exports.addExpense = async (req, res) => {
    const { expenseAmount, description, category } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const expense = await Expense.create({ expenseAmount, description, category, userId: req.user.userId }, { transaction });
        await User.increment('totalExpense', {
            by: expenseAmount,
            where: { userId: req.user.userId },
            transaction: transaction
        });
        await transaction.commit();
        res.status(201).json(expense);
    } catch (error) {
        await transaction.rollback();
        logger.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

exports.checkPremiumStatus = async (req, res) => {
    try {
        const premiumUser = await User.findOne({ where: { userId: req.user.userId } });

        if (!premiumUser) {
            return res.status(404).json({ error: 'No such user found' });
        }

        if (!premiumUser.premium) {
            return res.status(403).json({ error: 'User does not have a premium membership' });
        }

        res.status(200).json(premiumUser);
    } catch (error) {
        logger.error('Error checking premium status:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.json(leaderboard);
    } catch (error) {
        logger.error('Failed to fetch leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const result = await Expense.findOne({ where: { id, userId: req.user.userId } });

        await User.decrement('totalExpense', {
            by: result.expenseAmount,
            where: { userId: req.user.userId },
            transaction: transaction
        });
        await result.destroy({ transaction });
        await transaction.commit();
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        await transaction.rollback();
        logger.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};
