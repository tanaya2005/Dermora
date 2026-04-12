import express from 'express';
import {
  getAllConsultants,
  getConsultantSessions,
  markSessionPaid,
  processConsultantPayout,
  updateConsultantStatus,
  getConsultantStats,
} from '../controllers/consultantController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Consultant management routes
router.get('/stats', getConsultantStats);
router.get('/', getAllConsultants);
router.get('/:consultantId/sessions', getConsultantSessions);
router.put('/:consultantId/payment/:sessionId', markSessionPaid);
router.post('/:consultantId/payout', processConsultantPayout);
router.put('/:consultantId/status', updateConsultantStatus);

export default router;
