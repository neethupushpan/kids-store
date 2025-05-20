const express = require('express');
const prodctRouter = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { authAdmin } = require('../middlewares/authAdmin');

// Public routes
prodctRouter.get('/', getAllProducts);
prodctRouter.get('/:productId', getProductById);

// Admin-only routes
prodctRouter.post('/', authAdmin, createProduct);
prodctRouter.patch('/:productId', authAdmin, updateProduct);
prodctRouter.delete('/:productId', authAdmin, deleteProduct);

module.exports = prodctRouter;
