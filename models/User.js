const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Assuming you have a database configuration file
const Expense = require('./Expense'); // Import Expense model
const Order = require('./Order');
console.log('i am here');
const User = sequelize.define('user', {
    



    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Users are not premium by default
    },
    totalExpense: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
    },
});
User.associate = (models) => {
    User.hasMany(models.Expense, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'expense' });
    User.hasMany(models.Order, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'order' });
};

module.exports = User;
