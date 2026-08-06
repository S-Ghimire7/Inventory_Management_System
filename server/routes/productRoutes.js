const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// reading products is public so visitors can browse the catalogue,
// but adding/editing/deleting requires you to be logged in as admin
router.get('/', getAllProducts);
router.get('/:id', getOneProduct);
router.post('/', requireLogin, upload.single('productImage'), createProduct);
router.put('/:id', requireLogin, upload.single('productImage'), updateProduct);
router.delete('/:id', requireLogin, deleteProduct);

module.exports = router;
