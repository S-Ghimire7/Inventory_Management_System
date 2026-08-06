// just a little helper file so we can require all our models from one place
const Product = require('./Product');
const Supplier = require('./Supplier');
const User = require('./User');

module.exports = { Product, Supplier, User };
