import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  checkPendingReviews,
  getSellerReviewsDashboard,
  getAdminReviewsDashboard,
  markReviewHelpful,
  sellerReplyToReview,
  getSellerReviews,
  getSellerReviewsAnalytics,
  getAdminReviews,
  getAdminReviewsAnalytics,
  toggleReviewVisibility,
  upload,
} from '../controllers/reviewController.js';
import {
  getPendingReviews,
  moderateReview,
  bulkModerateReviews,
  getModerationStats,
  reportReview,
} from '../controllers/reviewModerationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOnly, sellerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/products/:productId', getProductReviews);

// Protected routes
router.post('/', authenticate, upload.array('photos', 5), createReview);
router.get('/user/my-reviews', authenticate, getUserReviews);
router.get('/user/pending', authenticate, checkPendingReviews);
router.post('/:reviewId/helpful', authenticate, markReviewHelpful);

// Seller routes
router.get('/seller/dashboard', authenticate, sellerOnly, getSellerReviewsDashboard);
router.get('/seller/reviews', authenticate, sellerOnly, getSellerReviews);
router.get('/seller/analytics', authenticate, sellerOnly, getSellerReviewsAnalytics);
router.post('/:reviewId/reply', authenticate, sellerOnly, sellerReplyToReview);

// Admin routes
router.get('/admin/dashboard', authenticate, adminOnly, getAdminReviewsDashboard);
router.get('/admin/reviews', authenticate, adminOnly, getAdminReviews);
router.get('/admin/analytics', authenticate, adminOnly, getAdminReviewsAnalytics);
router.patch('/admin/:reviewId/visibility', authenticate, adminOnly, toggleReviewVisibility);
router.get('/admin/moderation', authenticate, adminOnly, getPendingReviews);
router.get('/admin/moderation/stats', authenticate, adminOnly, getModerationStats);
router.patch('/admin/moderate/:id', authenticate, adminOnly, moderateReview);
router.patch('/admin/bulk-moderate', authenticate, adminOnly, bulkModerateReviews);

// Report review (authenticated users)
router.post('/:id/report', authenticate, reportReview);

export default router;