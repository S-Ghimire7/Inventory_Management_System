// all the CRUD logic for products lives here
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Product, Supplier } = require('../models');

// GET /api/products  (supports ?search=xyz&supplierId=2)
async function getAllProducts(req, res) {
  try {
    const { search, supplierId } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.prodName = { [Op.like]: `%${search}%` };
    }

    if (supplierId) {
      whereClause.supplierId = supplierId;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{ model: Supplier, attributes: ['id', 'supName'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(products);
  } catch (err) {
    console.log('getAllProducts error:', err);
    res.status(500).json({ message: 'Could not fetch products' });
  }
}

// GET /api/products/:id
async function getOneProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, attributes: ['id', 'supName', 'supEmail', 'supPhone'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.log('getOneProduct error:', err);
    res.status(500).json({ message: 'Could not fetch that product' });
  }
}

// small helper to check the fields the client sent us before we save anything
// server side validation is the real source of truth, client validation is just for nice UX
function validateProductFields(body) {
  const errors = {};

  if (!body.prodName || body.prodName.trim() === '') {
    errors.prodName = 'Product name is required';
  }

  if (body.price === undefined || body.price === '' || isNaN(body.price)) {
    errors.price = 'Price must be a number';
  } else if (Number(body.price) < 0) {
    errors.price = 'Price cannot be negative';
  }

  if (body.stockQty === undefined || body.stockQty === '' || isNaN(body.stockQty)) {
    errors.stockQty = 'Stock quantity must be a number';
  } else if (Number(body.stockQty) < 0) {
    errors.stockQty = 'Stock quantity cannot be negative';
  } else if (!Number.isInteger(Number(body.stockQty))) {
    errors.stockQty = 'Stock quantity must be a whole number';
  }

  if (!body.supplierId) {
    errors.supplierId = 'You must pick a supplier';
  }

  return errors;
}

// POST /api/products
async function createProduct(req, res) {
  try {
    const fieldErrors = validateProductFields(req.body);

    if (Object.keys(fieldErrors).length > 0) {
      // if they uploaded a file but the rest of the form was bad, clean up the orphan file
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please fix the errors below', errors: fieldErrors });
    }

    // make sure the supplier they picked actually exists
    const supplierExists = await Supplier.findByPk(req.body.supplierId);
    if (!supplierExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please fix the errors below', errors: { supplierId: 'That supplier does not exist' } });
    }

    const newProduct = await Product.create({
      prodName: req.body.prodName.trim(),
      prodDesc: req.body.prodDesc ? req.body.prodDesc.trim() : '',
      price: Number(req.body.price),
      stockQty: Number(req.body.stockQty),
      supplierId: req.body.supplierId,
      imagePath: req.file ? req.file.filename : null
    });

    const productWithSupplier = await Product.findByPk(newProduct.id, {
      include: [{ model: Supplier, attributes: ['id', 'supName'] }]
    });

    res.status(201).json(productWithSupplier);
  } catch (err) {
    console.log('createProduct error:', err);
    res.status(500).json({ message: 'Could not create product' });
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Product not found' });
    }

    const fieldErrors = validateProductFields(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please fix the errors below', errors: fieldErrors });
    }

    const supplierExists = await Supplier.findByPk(req.body.supplierId);
    if (!supplierExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please fix the errors below', errors: { supplierId: 'That supplier does not exist' } });
    }

    // if a new image was uploaded, delete the old one so we don't fill up the disk
    let oldImageToDelete = null;
    if (req.file && product.imagePath) {
      oldImageToDelete = path.join(__dirname, '..', 'uploads', product.imagePath);
    }

    product.prodName = req.body.prodName.trim();
    product.prodDesc = req.body.prodDesc ? req.body.prodDesc.trim() : '';
    product.price = Number(req.body.price);
    product.stockQty = Number(req.body.stockQty);
    product.supplierId = req.body.supplierId;
    if (req.file) {
      product.imagePath = req.file.filename;
    }

    await product.save();

    if (oldImageToDelete && fs.existsSync(oldImageToDelete)) {
      fs.unlinkSync(oldImageToDelete);
    }

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'supName'] }]
    });

    res.json(updatedProduct);
  } catch (err) {
    console.log('updateProduct error:', err);
    res.status(500).json({ message: 'Could not update product' });
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // remove the image file off disk too, no point keeping it around
    if (product.imagePath) {
      const imgPath = path.join(__dirname, '..', 'uploads', product.imagePath);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.log('deleteProduct error:', err);
    res.status(500).json({ message: 'Could not delete product' });
  }
}

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
