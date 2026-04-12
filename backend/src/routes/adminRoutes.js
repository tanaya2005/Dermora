import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminStats,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Admin routes
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.get('/stats', getAdminStats);

export default router;
