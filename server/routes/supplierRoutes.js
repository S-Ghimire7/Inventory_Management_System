const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/authMiddleware');
const {
  getAllSuppliers,
  getOneSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

router.get('/', getAllSuppliers);
router.get('/:id', getOneSupplier);
router.post('/', requireLogin, createSupplier);
router.put('/:id', requireLogin, updateSupplier);
router.delete('/:id', requireLogin, deleteSupplier);

module.exports = router;
