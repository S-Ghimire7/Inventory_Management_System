// product model - this is the main entity of the inventory system
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Supplier = require('./Supplier');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prodName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' }
    }
  },
  prodDesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Price cannot be negative' }
    }
  },
  stockQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Stock quantity cannot be negative' }
    }
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true // filename of the uploaded product image, can be empty if none uploaded
  }
});

// a product belongs to one supplier, a supplier can have many products
Product.belongsTo(Supplier, { foreignKey: 'supplierId', onDelete: 'CASCADE' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });

module.exports = Product;
