const { Supplier, Product } = require('../models');

function validateSupplierFields(body) {
  const errors = {};

  if (!body.supName || body.supName.trim() === '') {
    errors.supName = 'Supplier name is required';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.supEmail || body.supEmail.trim() === '') {
    errors.supEmail = 'Supplier email is required';
  } else if (!emailPattern.test(body.supEmail.trim())) {
    errors.supEmail = 'Please enter a valid email address';
  }

  return errors;
}

async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.findAll({ order: [['supName', 'ASC']] });
    res.json(suppliers);
  } catch (err) {
    console.log('getAllSuppliers error:', err);
    res.status(500).json({ message: 'Could not fetch suppliers' });
  }
}

async function getOneSupplier(req, res) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    console.log('getOneSupplier error:', err);
    res.status(500).json({ message: 'Could not fetch that supplier' });
  }
}

async function createSupplier(req, res) {
  try {
    const fieldErrors = validateSupplierFields(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ message: 'Please fix the errors below', errors: fieldErrors });
    }

    const newSupplier = await Supplier.create({
      supName: req.body.supName.trim(),
      supEmail: req.body.supEmail.trim(),
      supPhone: req.body.supPhone ? req.body.supPhone.trim() : ''
    });

    res.status(201).json(newSupplier);
  } catch (err) {
    console.log('createSupplier error:', err);
    res.status(500).json({ message: 'Could not create supplier' });
  }
}

async function updateSupplier(req, res) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const fieldErrors = validateSupplierFields(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ message: 'Please fix the errors below', errors: fieldErrors });
    }

    supplier.supName = req.body.supName.trim();
    supplier.supEmail = req.body.supEmail.trim();
    supplier.supPhone = req.body.supPhone ? req.body.supPhone.trim() : '';
    await supplier.save();

    res.json(supplier);
  } catch (err) {
    console.log('updateSupplier error:', err);
    res.status(500).json({ message: 'Could not update supplier' });
  }
}

async function deleteSupplier(req, res) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const productCount = await Product.count({ where: { supplierId: supplier.id } });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete this supplier because it still has ${productCount} product(s) linked to it. Reassign or delete those products first.`
      });
    }

    await supplier.destroy();
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    console.log('deleteSupplier error:', err);
    res.status(500).json({ message: 'Could not delete supplier' });
  }
}

module.exports = {
  getAllSuppliers,
  getOneSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
