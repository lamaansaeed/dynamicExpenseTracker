const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASS,{
    dialect:'mysql',
    host:'localhost',
    port: process.env.DATABASE_PORT,
});

module.exports = sequelize;