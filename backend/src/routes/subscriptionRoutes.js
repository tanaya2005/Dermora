import express from 'express';
import {
  createSubscriptionOrder,
  verifySubscription,
  getMyPlan,
  cancelSubscription,
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.post('/create-order', authenticate, createSubscriptionOrder);
router.post('/verify', authenticate, verifySubscription);
router.get('/my-plan', authenticate, getMyPlan);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
