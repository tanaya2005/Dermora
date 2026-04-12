import express from 'express';
import { getSellerDashboard } from '../controllers/sellerDashboardController.js';
import { getSellerAnalytics } from '../controllers/sellerAnalyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { sellerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, sellerOnly, getSellerDashboard);
router.get('/analytics', authenticate, sellerOnly, getSellerAnalytics);

export default router;
