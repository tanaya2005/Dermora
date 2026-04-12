import User from '../models/User.js';

/**
 * GET /api/admin/users
 * Get all users with their details
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:userId/role
 * Update user role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'SELLER', 'BUYER', 'DERMATOLOGIST'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:userId
 * Delete a user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyers = await User.countDocuments({ role: 'BUYER' });
    const sellers = await User.countDocuments({ role: 'SELLER' });
    const dermatologists = await User.countDocuments({ role: 'DERMATOLOGIST' });
    const activeSubscriptions = await User.countDocuments({ 'subscription.isActive': true });
    const completedAssessments = await User.countDocuments({ 'skinProfile.assessmentCompleted': true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        buyers,
        sellers,
        dermatologists,
        activeSubscriptions,
        completedAssessments,
      },
    });
  } catch (error) {
    next(error);
  }
};
