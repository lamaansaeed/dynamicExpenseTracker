const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Adjust the path if necessary
const User = require('./User');
console.log(User);
const Expense = sequelize.define('expense', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Ensure the model name is correct
            key: 'userId'
        }
    }
});
Expense.hasOne(User, { foreignKey: 'userId',as:'expense' });
module.exports = Expense;