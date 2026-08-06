// this file sets up the connection to our sqlite database using sequelize
const { Sequelize } = require('sequelize');
const path = require('path');

// the database file will just live in the server folder, easy for coursework
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false // set to console.log if you want to see the sql queries it runs
});

module.exports = sequelize;
