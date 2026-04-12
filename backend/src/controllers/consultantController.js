import User from '../models/User.js';
import Consultation from '../models/Consultation.js';

/**
 * GET /api/admin/consultants
 * Get all dermatologists/consultants with their session stats
 */
export const getAllConsultants = async (req, res, next) => {
  try {
    const consultants = await User.find({ role: 'DERMATOLOGIST' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get session stats for each consultant
    const consultantsWithStats = await Promise.all(
      consultants.map(async (consultant) => {
        const totalSessions = await Consultation.countDocuments({ 
          dermatologistId: consultant._id 
        });
        
        const completedSessions = await Consultation.countDocuments({ 
          dermatologistId: consultant._id,
          status: 'completed'
        });
        
        const scheduledSessions = await Consultation.countDocuments({ 
          dermatologistId: consultant._id,
          status: 'scheduled'
        });
        
        const cancelledSessions = await Consultation.countDocuments({ 
          dermatologistId: consultant._id,
          status: 'cancelled'
        });

        // Calculate total earnings (completed sessions only)
        const earnings = await Consultation.aggregate([
          { 
            $match: { 
              dermatologistId: consultant._id,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$sessionFee' },
              paid: { 
                $sum: { 
                  $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$sessionFee', 0] 
                }
              },
              pending: { 
                $sum: { 
                  $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$sessionFee', 0] 
                }
              }
            }
          }
        ]);

        // Calculate average rating
        const ratingData = await Consultation.aggregate([
          { 
            $match: { 
              dermatologistId: consultant._id,
              rating: { $exists: true, $ne: null }
            }
          },
          {
            $group: {
              _id: null,
              avgRating: { $avg: '$rating' },
              totalRatings: { $sum: 1 }
            }
          }
        ]);

        return {
          ...consultant.toObject(),
          stats: {
            totalSessions,
            completedSessions,
            scheduledSessions,
            cancelledSessions,
            totalEarnings: earnings[0]?.total || 0,
            paidAmount: earnings[0]?.paid || 0,
            pendingAmount: earnings[0]?.pending || 0,
            averageRating: ratingData[0]?.avgRating || 0,
            totalRatings: ratingData[0]?.totalRatings || 0,
          }
        };
      })
    );

    res.json({
      success: true,
      consultants: consultantsWithStats,
      total: consultantsWithStats.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/consultants/:consultantId/sessions
 * Get all sessions for a specific consultant
 */
export const getConsultantSessions = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { dermatologistId: consultantId };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.sessionDate = {};
      if (startDate) query.sessionDate.$gte = new Date(startDate);
      if (endDate) query.sessionDate.$lte = new Date(endDate);
    }

    const sessions = await Consultation.find(query)
      .populate('customerId', 'name email')
      .sort({ sessionDate: -1 });

    res.json({
      success: true,
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/consultants/:consultantId/payment/:sessionId
 * Mark session payment as paid
 */
export const markSessionPaid = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Consultation.findByIdAndUpdate(
      sessionId,
      { 
        paymentStatus: 'paid',
        paymentDate: new Date()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      message: 'Payment marked as paid',
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/consultants/:consultantId/payout
 * Process bulk payout for consultant
 */
export const processConsultantPayout = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { sessionIds } = req.body;

    if (!sessionIds || !Array.isArray(sessionIds)) {
      return res.status(400).json({ error: 'Session IDs array required' });
    }

    // Update all sessions to paid
    const result = await Consultation.updateMany(
      {
        _id: { $in: sessionIds },
        dermatologistId: consultantId,
        status: 'completed',
        paymentStatus: 'pending'
      },
      {
        paymentStatus: 'paid',
        paymentDate: new Date()
      }
    );

    // Calculate total payout
    const sessions = await Consultation.find({ _id: { $in: sessionIds } });
    const totalPayout = sessions.reduce((sum, session) => sum + session.sessionFee, 0);

    res.json({
      success: true,
      message: `Payout processed for ${result.modifiedCount} sessions`,
      totalPayout,
      sessionsUpdated: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/consultants/:consultantId/status
 * Update consultant status (active/inactive)
 */
export const updateConsultantStatus = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { isActive } = req.body;

    const consultant = await User.findByIdAndUpdate(
      consultantId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.json({
      success: true,
      message: `Consultant ${isActive ? 'activated' : 'deactivated'}`,
      consultant,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/consultants/stats
 * Get overall consultant statistics
 */
export const getConsultantStats = async (req, res, next) => {
  try {
    const totalConsultants = await User.countDocuments({ role: 'DERMATOLOGIST' });
    const activeConsultants = await User.countDocuments({ role: 'DERMATOLOGIST', isActive: true });
    
    const totalSessions = await Consultation.countDocuments();
    const completedSessions = await Consultation.countDocuments({ status: 'completed' });
    const scheduledSessions = await Consultation.countDocuments({ status: 'scheduled' });
    
    const earnings = await Consultation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$sessionFee' },
          paid: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$sessionFee', 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$sessionFee', 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalConsultants,
        activeConsultants,
        totalSessions,
        completedSessions,
        scheduledSessions,
        totalEarnings: earnings[0]?.total || 0,
        paidAmount: earnings[0]?.paid || 0,
        pendingPayouts: earnings[0]?.pending || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
