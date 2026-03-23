import express from 'express';
import { saveAssessment, getAssessment } from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Assessment routes
router.post('/', saveAssessment);
router.get('/', getAssessment);

export default router;