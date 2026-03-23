import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticate, addToWishlist);
router.get('/', authenticate, getWishlist);
router.delete('/:itemId', authenticate, removeFromWishlist);

export default router;
