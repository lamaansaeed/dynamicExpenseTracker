
const User = require('../models/User');
const sequelize = require('../database/database');
const Income = require('../models/Income');
const logger = require('../logger');
exports.getIncomes = async (req, res) => {
    try {
        const Incomes = await Income.findAll({ where: { userId: req.user.userId } });
        res.json(Incomes);
    } catch (error) {
        logger.error('Error fetching incomes:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

exports.addIncome = async (req, res) => {
    const { incomeAmount, description, category } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const income = await Income.create({ incomeAmount, description, category, userId: req.user.userId }, { transaction });
        await User.increment('totalIncome', {
            by: incomeAmount,
            where: { userId: req.user.userId },
            transaction: transaction
        });
        await transaction.commit();
        res.status(201).json(income);
    } catch (error) {
        await transaction.rollback();
        logger.error('Error adding income:', error);
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
            attributes: ['name', 'totalIncome'],
            order: [['totalIncome', 'DESC']]
        });

        res.json(leaderboard);
    } catch (error) {
        logger.error('Failed to fetch leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const result = await Expense.findOne({ where: { id, userId: req.user.userId } });

        await User.decrement('totalIncome', {
            by: result.incomeAmount,
            where: { userId: req.user.userId },
            transaction: transaction
        });
        await result.destroy({ transaction });
        await transaction.commit();
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Income not found' });
        }
    } catch (error) {
        await transaction.rollback();
        logger.error('Error deleting income:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};
