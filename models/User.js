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
    }
});
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE',as:'expense' });
Expense.hasOne(User, { foreignKey: 'userId',as:'user' });
User.hasMany(Order,{ foreignKey: 'userId', onDelete: 'CASCADE' ,as:'order'})
Order.hasOne(User, { foreignKey: 'userId',as:'user' })

module.exports = User;
