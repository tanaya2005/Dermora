import express from 'express';
import {
  createOrder,
  getUserOrders,
  getSellerOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOnly, sellerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/create', authenticate, createOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/seller', authenticate, sellerOnly, getSellerOrders);
router.get('/admin', authenticate, adminOnly, getAllOrders);

export default router;
