const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Adjust the path if necessary

const Expense = sequelize.define('Expense', {
    amount: {
        type: DataTypes.FLOAT, // Use FLOAT for expense amount
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Expense;
