// supplier model - holds the companies that supply our products
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Supplier name cannot be empty' }
    }
  },
  supEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: 'Supplier email must be a valid email address' }
    }
  },
  supPhone: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Supplier;
