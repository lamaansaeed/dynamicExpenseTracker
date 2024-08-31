const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Adjust the path if necessary
const User = require('./User')
const Income = sequelize.define('income', {
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
Income.associate = (models) => {
    Income.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Income;