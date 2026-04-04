import express from 'express';
const router = express.Router();
import {
  getActiveAds,
  recordImpression,
  recordClick,
  createAd,
  getAllAds,
  updateAd,
  deleteAd
} from '../controllers/advertisementController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

// Public routes
router.get('/active', getActiveAds);
router.post('/:adId/impression', recordImpression);
router.post('/:adId/click', recordClick);

// Admin routes
router.post('/', authenticate, requireRole('ADMIN'), createAd);
router.get('/all', authenticate, requireRole('ADMIN'), getAllAds);
router.put('/:adId', authenticate, requireRole('ADMIN'), updateAd);
router.delete('/:adId', authenticate, requireRole('ADMIN'), deleteAd);

export default router;