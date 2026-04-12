import express from 'express';
import {
  calculateListingFee,
  createListingFeeOrder,
  verifyListingFeePayment,
  getListingFeeHistory,
} from '../controllers/listingFeeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { sellerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/calculate', authenticate, sellerOnly, calculateListingFee);
router.post('/create-order', authenticate, sellerOnly, createListingFeeOrder);
router.post('/verify', authenticate, sellerOnly, verifyListingFeePayment);
router.get('/history', authenticate, sellerOnly, getListingFeeHistory);

export default router;
