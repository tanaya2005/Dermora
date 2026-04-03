import express from 'express';
import { getSellerAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Seller analytics (Accessible by SELLERS and ADMINS)
router.get('/seller', authenticate, requireRole('SELLER', 'ADMIN'), getSellerAnalytics);

// Admin analytics (Only accessible by ADMINS)
router.get('/admin', authenticate, requireRole('ADMIN'), getAdminAnalytics);

export default router;
