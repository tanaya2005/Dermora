import Review from '../models/Review.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * Get reviews pending moderation
 * GET /api/reviews/admin/moderation
 */
export const getPendingReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, filter = 'all' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let matchConditions = {};
    
    switch (filter) {
      case 'reported':
        matchConditions.reportedCount = { $gt: 0 };
        break;
      case 'low-rating':
        matchConditions.rating = { $lte: 2 };
        break;
      case 'negative-sentiment':
        matchConditions.sentiment = 'negative';
        break;
      case 'flagged':
        matchConditions.moderationStatus = 'flagged';
        break;
      default:
        // All reviews that might need attention
        matchConditions.$or = [
          { reportedCount: { $gt: 0 } },
          { rating: { $lte: 2 } },
          { sentiment: 'negative' },
          { moderationStatus: 'flagged' }
        ];
    }

    const [reviews, total] = await Promise.all([
      Review.find(matchConditions)
        .populate('userId', 'name email profileImage')
        .populate('productId', 'title imageUrl')
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(matchConditions)
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Moderate a review (approve, reject, flag)
 * PATCH /api/reviews/admin/moderate/:id
 */
export const moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason, adminNote } = req.body;

    if (!['approve', 'reject', 'flag', 'hide'].includes(action)) {
      return res.status(400).json({ error: 'Invalid moderation action' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update review moderation status
    const updateData = {
      moderationStatus: action,
      moderatedBy: req.user.id,
      moderatedAt: new Date(),
      moderationReason: reason,
      adminNote: adminNote
    };

    if (action === 'hide') {
      updateData.isVisible = false;
    } else if (action === 'approve') {
      updateData.isVisible = true;
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'name email')
      .populate('productId', 'title');

    // Log moderation action
    console.log(`Review ${id} ${action}ed by admin ${req.user.id}. Reason: ${reason}`);

    res.json({ 
      review: updatedReview,
      message: `Review ${action}ed successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk moderate reviews
 * PATCH /api/reviews/admin/bulk-moderate
 */
export const bulkModerateReviews = async (req, res, next) => {
  try {
    const { reviewIds, action, reason } = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({ error: 'Review IDs array is required' });
    }

    if (!['approve', 'reject', 'flag', 'hide'].includes(action)) {
      return res.status(400).json({ error: 'Invalid moderation action' });
    }

    const updateData = {
      moderationStatus: action,
      moderatedBy: req.user.id,
      moderatedAt: new Date(),
      moderationReason: reason
    };

    if (action === 'hide') {
      updateData.isVisible = false;
    } else if (action === 'approve') {
      updateData.isVisible = true;
    }

    const result = await Review.updateMany(
      { _id: { $in: reviewIds } },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} reviews ${action}ed successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get moderation statistics
 * GET /api/reviews/admin/moderation/stats
 */
export const getModerationStats = async (req, res, next) => {
  try {
    const [totalReviews, pendingModeration, moderatedToday, reportedReviews] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({
        $or: [
          { reportedCount: { $gt: 0 } },
          { moderationStatus: { $in: ['pending', 'flagged'] } }
        ]
      }),
      Review.countDocuments({
        moderatedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      Review.countDocuments({ reportedCount: { $gt: 0 } })
    ]);

    const moderationBreakdown = await Review.aggregate([
      {
        $group: {
          _id: '$moderationStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const sentimentBreakdown = await Review.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalReviews,
      pendingModeration,
      moderatedToday,
      reportedReviews,
      moderationBreakdown: moderationBreakdown.reduce((acc, item) => {
        acc[item._id || 'unmoderated'] = item.count;
        return acc;
      }, {}),
      sentimentBreakdown: sentimentBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report a review
 * POST /api/reviews/:id/report
 */
export const reportReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, description } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Increment report count
    await Review.findByIdAndUpdate(id, {
      $inc: { reportedCount: 1 },
      $push: {
        reports: {
          reportedBy: req.user.id,
          reason,
          description,
          reportedAt: new Date()
        }
      }
    });

    // Auto-flag if too many reports
    if (review.reportedCount >= 3) {
      await Review.findByIdAndUpdate(id, {
        moderationStatus: 'flagged',
        isVisible: false
      });
    }

    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    next(error);
  }
};