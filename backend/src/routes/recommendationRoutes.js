import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Recommendation routes
router.get('/', getRecommendations);

export default router;