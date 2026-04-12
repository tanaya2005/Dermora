import express from 'express';
import {
  createOrder,
  getUserOrders,
  getSellerOrders,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  addTrackingNumber,
  updatePayoutStatus,
  getSellerOrderDetails,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOnly, sellerOnly } from '../middleware/roleMiddleware.js';
import { checkPendingReviewsBeforeOrder } from '../middleware/reviewMiddleware.js';

const router = express.Router();

router.post('/create', authenticate, checkPendingReviewsBeforeOrder, createOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/seller', authenticate, sellerOnly, getSellerOrders);
router.get('/seller/:id', authenticate, sellerOnly, getSellerOrderDetails);
router.get('/admin', authenticate, adminOnly, getAllOrders);
router.get('/admin/:id', authenticate, adminOnly, getOrderDetails);
router.put('/:id/status', authenticate, updateOrderStatus); // Allow both admin and seller
router.put('/:id/tracking', authenticate, adminOnly, addTrackingNumber);
router.put('/payout/:payoutId/status', authenticate, adminOnly, updatePayoutStatus);

export default router;
