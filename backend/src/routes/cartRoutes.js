import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.delete('/:itemId', authenticate, removeFromCart);

export default router;
