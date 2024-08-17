const Sequelize = require('sequelize');


const sequelize = new Sequelize('expenseTracker','root','safoora777',{
    dialect:'mysql',
    host:'localhost',
    port: 3306
});

module.exports = sequelize;