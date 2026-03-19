import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { sellerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticate, sellerOnly, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, sellerOnly, updateProduct);
router.delete('/:id', authenticate, sellerOnly, deleteProduct);

export default router;
