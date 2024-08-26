const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true, // This will be null until the payment is completed
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Each order must have a unique ID
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // Status can be 'pending', 'completed', or 'failed'
    }
}, {
    tableName: 'orders'
});

module.exports = Order;
