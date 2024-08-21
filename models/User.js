const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Assuming you have a database configuration file
const Expense = require('./TempExpense'); // Import Expense model

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
    }
});
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = User;
