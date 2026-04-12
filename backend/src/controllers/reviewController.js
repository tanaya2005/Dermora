import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { createReviewSchema, updateReviewSchema } from '../validators/index.js';
import { handleLowRatingRetention } from '../services/customerRetentionService.js';
import { calculateHealthScore } from '../services/productHealthService.js';
import { classifySentiment, getKeywordFrequency } from '../utils/sentiment.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/reviews';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5 // Maximum 5 files
  }
});

/**
 * Check if user can review a product
 */
const canUserReview = async (userId, productId, orderId) => {
  // Check if order exists and belongs to user
  const order = await Order.findOne({
    _id: orderId,
    buyerId: userId,
    status: 'DELIVERED'
  });
  
  if (!order) {
    return { canReview: false, reason: 'Order not found or not delivered yet' };
  }
  
  // Check if product is in the order
  const productInOrder = order.orderItems.some(
    item => item.productId.toString() === productId.toString()
  );
  
  if (!productInOrder) {
    return { canReview: false, reason: 'Product not found in this order' };
  }
  
  // Check if user already reviewed this product for this order
  const existingReview = await Review.findOne({ userId, productId, orderId });
  if (existingReview) {
    return { canReview: false, reason: 'You have already reviewed this product for this order' };
  }
  
  return { canReview: true, orderId: order._id };
};

/**
 * Check if user has pending reviews (mandatory review system)
 */
export const checkPendingReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find delivered orders without reviews
    const deliveredOrders = await Order.find({
      buyerId: userId,
      status: 'DELIVERED'
    }).populate('orderItems.productId');
    
    const pendingReviews = [];
    
    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        const existingReview = await Review.findOne({
          userId,
          productId: item.productId._id
        });
        
        if (!existingReview) {
          pendingReviews.push({
            orderId: order._id,
            productId: item.productId._id,
            productTitle: item.productId.title,
            orderDate: order.createdAt
          });
        }
      }
    }
    
    res.json({ pendingReviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new review with photo upload
 * POST /reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, orderId, rating, comment } = req.body;
    
    // Validate required fields
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({ 
        error: 'All fields are required: productId, orderId, rating, comment' 
      });
    }
    
    // Validate rating
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Validate comment length
    if (comment.length < 20 || comment.length > 2000) {
      return res.status(400).json({ error: 'Comment must be between 20 and 2000 characters' });
    }
    
    // Validate photos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }
    
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 photos allowed' });
    }
    
    // Check if user can review this product
    const reviewCheck = await canUserReview(userId, productId, orderId);
    if (!reviewCheck.canReview) {
      // Clean up uploaded files
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(400).json({ error: reviewCheck.reason });
    }
    
    // Get product and seller info
    const product = await Product.findById(productId);
    if (!product) {
      // Clean up uploaded files
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get photo URLs (relative paths)
    const photoUrls = req.files.map(file => `/uploads/reviews/${file.filename}`);
    
    // Analyze sentiment
    const sentimentResult = classifySentiment(comment);
    
    // Create review
    const review = await Review.create({
      userId,
      productId,
      orderId,
      sellerId: product.sellerId,
      rating: ratingNum,
      comment: comment.trim(),
      photos: photoUrls,
      sentiment: sentimentResult.sentiment,
      sentimentKeywordsMatched: sentimentResult.matched,
    });
    
    await review.populate([
      { path: 'userId', select: 'name profileImage' },
      { path: 'productId', select: 'title imageUrl' }
    ]);
    
    // Update product rating statistics
    await updateProductRating(productId);
    
    // Calculate health score
    await calculateHealthScore(productId);
    
    // Mark review as submitted in order
    await Order.findOneAndUpdate(
      { _id: orderId, 'pendingReviews.productId': productId },
      { $set: { 'pendingReviews.$.reviewSubmitted': true } }
    );
    
    // Handle customer retention for low ratings
    let retentionStrategy = null;
    if (ratingNum <= 2) {
      retentionStrategy = await handleLowRatingRetention(
        userId, 
        productId, 
        ratingNum
      );
    }
    
    res.status(201).json({ 
      review,
      retentionStrategy 
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
    next(error);
  }
};

/**
 * Get reviews for a product
 * GET /reviews/:productId
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: 'Invalid product ID'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    
    // Only show approved and visible reviews
    const reviewQuery = { 
      productId: new mongoose.Types.ObjectId(productId),
      moderationStatus: 'approved',
      isVisible: true
    };
    
    const [reviews, total, stats] = await Promise.all([
      Review.find(reviewQuery)
        .populate('userId', 'name profileImage')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(reviewQuery),
      Review.aggregate([
        { $match: reviewQuery },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            },
            sentimentDistribution: {
              $push: '$sentiment'
            }
          }
        }
      ])
    ]);
    
    // Calculate rating distribution
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    
    if (stats.length > 0) {
      stats[0].ratingDistribution.forEach(rating => {
        ratingCounts[rating]++;
      });
      
      stats[0].sentimentDistribution.forEach(sentiment => {
        sentimentCounts[sentiment]++;
      });
    }
    
    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: {
        averageRating: stats.length > 0 ? stats[0].averageRating : 0,
        totalReviews: total,
        ratingDistribution: ratingCounts,
        sentimentDistribution: sentimentCounts
      }
    });
  } catch (error) {
    console.error('Error in getProductReviews:', error);
    next(error);
  }
};

/**
 * Get user's reviews
 * GET /reviews/user/my-reviews
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, total] = await Promise.all([
      Review.find({ userId })
        .populate('productId', 'title imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ userId })
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
 * Update product rating statistics
 */
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        negativeReviews: {
          $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] }
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    const { averageRating, totalReviews, negativeReviews } = stats[0];
    const negativePercentage = (negativeReviews / totalReviews) * 100;
    
    // Determine product status
    let status = 'healthy';
    if (averageRating < 3 || negativePercentage > 40) {
      status = negativePercentage > 60 ? 'critical' : 'warning';
    }
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      negativePercentage: Math.round(negativePercentage),
      status
    });
  }
};

/**
 * Get seller reviews dashboard
 * GET /reviews/seller/dashboard
 */
export const getSellerReviewsDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    
    const [recentReviews, stats, flaggedProducts] = await Promise.all([
      // Recent reviews for seller's products
      Review.find({ sellerId })
        .populate('productId', 'title imageUrl')
        .populate('userId', 'name profileImage')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Overall stats
      Review.aggregate([
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            negativeReviews: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
            positiveReviews: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } }
          }
        }
      ]),
      
      // Flagged products
      Product.find({ 
        sellerId, 
        status: { $in: ['warning', 'critical'] } 
      }).select('title averageRating totalReviews status')
    ]);
    
    res.json({
      recentReviews,
      stats: stats.length > 0 ? stats[0] : {
        averageRating: 0,
        totalReviews: 0,
        negativeReviews: 0,
        positiveReviews: 0
      },
      flaggedProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get admin reviews dashboard
 * GET /reviews/admin/dashboard
 */
export const getAdminReviewsDashboard = async (req, res, next) => {
  try {
    const [overallStats, flaggedProducts, topProducts, lowRatingProducts] = await Promise.all([
      // Overall platform stats
      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            negativeReviews: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
          }
        }
      ]),
      
      // Flagged products
      Product.find({ status: { $in: ['warning', 'critical'] } })
        .populate('sellerId', 'name email')
        .select('title averageRating totalReviews status')
        .sort({ averageRating: 1 })
        .limit(20),
      
      // Top rated products
      Product.find({ totalReviews: { $gte: 5 } })
        .select('title averageRating totalReviews')
        .sort({ averageRating: -1 })
        .limit(10),
      
      // Low rating products
      Product.find({ averageRating: { $lt: 3, $gt: 0 } })
        .populate('sellerId', 'name email')
        .select('title averageRating totalReviews')
        .sort({ averageRating: 1 })
        .limit(10)
    ]);
    
    const complaintPercentage = overallStats.length > 0 
      ? Math.round((overallStats[0].negativeReviews / overallStats[0].totalReviews) * 100)
      : 0;
    
    res.json({
      overallStats: overallStats.length > 0 ? {
        ...overallStats[0],
        complaintPercentage
      } : {
        averageRating: 0,
        totalReviews: 0,
        negativeReviews: 0,
        complaintPercentage: 0
      },
      flaggedProducts,
      topProducts,
      lowRatingProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark review as helpful
 * POST /reviews/:reviewId/helpful
 */
export const markReviewHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Check if user already marked this review as helpful
    const alreadyVoted = review.helpfulVotes.some(
      vote => vote.toString() === userId.toString()
    );
    
    if (alreadyVoted) {
      return res.status(400).json({ error: 'You have already marked this review as helpful' });
    }
    
    // Add user to helpful votes
    review.helpfulVotes.push(userId);
    review.helpfulCount = review.helpfulVotes.length;
    await review.save();
    
    res.json({ 
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Seller reply to review
 * POST /reviews/:reviewId/reply
 */
export const sellerReplyToReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;
    const sellerId = req.user.id;
    
    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ error: 'Reply text is required' });
    }
    
    if (reply.length > 1000) {
      return res.status(400).json({ error: 'Reply must be 1000 characters or less' });
    }
    
    const review = await Review.findById(reviewId).populate('productId');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Verify seller owns the product
    if (review.productId.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ error: 'You can only reply to reviews of your own products' });
    }
    
    review.sellerReply = reply.trim();
    review.sellerRepliedAt = new Date();
    await review.save();
    
    res.json({ 
      message: 'Reply posted successfully',
      review 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get seller reviews with filters
 * GET /reviews/seller/reviews
 */
export const getSellerReviews = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const { 
      page = 1, 
      limit = 10, 
      productId, 
      sentiment, 
      rating,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    
    // Build query
    const query = { sellerId: new mongoose.Types.ObjectId(sellerId) };
    
    if (productId) {
      query.productId = new mongoose.Types.ObjectId(productId);
    }
    
    if (sentiment) {
      query.sentiment = sentiment;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('productId', 'title imageUrl')
        .populate('userId', 'name profileImage')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
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
 * Get seller reviews analytics
 * GET /reviews/seller/analytics
 */
export const getSellerReviewsAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    
    // Overall stats
    const overallStats = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          positiveCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          neutralCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
          negativeCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          repliedCount: { $sum: { $cond: [{ $ne: ['$sellerReply', null] }, 1, 0] } }
        }
      }
    ]);
    
    const overall = overallStats.length > 0 ? overallStats[0] : {
      avgRating: 0,
      totalReviews: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      rating5: 0,
      rating4: 0,
      rating3: 0,
      rating2: 0,
      rating1: 0,
      repliedCount: 0
    };
    
    // Calculate response rate
    const responseRate = overall.totalReviews > 0 
      ? Math.round((overall.repliedCount / overall.totalReviews) * 100)
      : 0;
    
    // By product stats
    const byProduct = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
          keywords: { $push: '$sentimentKeywordsMatched' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          productName: '$product.title',
          avgRating: 1,
          reviewCount: 1,
          sentiment: {
            positive: '$positive',
            neutral: '$neutral',
            negative: '$negative'
          },
          keywords: 1
        }
      },
      { $sort: { reviewCount: -1 } }
    ]);
    
    // Process keywords for each product
    const byProductWithKeywords = byProduct.map(product => {
      const allKeywords = product.keywords.flat();
      const keywordFreq = {};
      allKeywords.forEach(kw => {
        keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
      });
      const topKeywords = Object.entries(keywordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word]) => word);
      
      return {
        ...product,
        topKeywords,
        keywords: undefined
      };
    });
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Review.aggregate([
      { 
        $match: { 
          sellerId: new mongoose.Types.ObjectId(sellerId),
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format monthly trend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyTrend = monthlyTrend.map(item => ({
      month: monthNames[item._id.month - 1],
      avgRating: Math.round(item.avgRating * 10) / 10,
      count: item.count
    }));
    
    // Recent negative reviews
    const recentNegative = await Review.find({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      sentiment: 'negative'
    })
      .populate('productId', 'title imageUrl')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      overall: {
        avgRating: Math.round(overall.avgRating * 10) / 10,
        totalReviews: overall.totalReviews,
        sentimentBreakdown: {
          positive: overall.positiveCount,
          neutral: overall.neutralCount,
          negative: overall.negativeCount
        },
        ratingBreakdown: {
          5: overall.rating5,
          4: overall.rating4,
          3: overall.rating3,
          2: overall.rating2,
          1: overall.rating1
        }
      },
      byProduct: byProductWithKeywords,
      monthlyTrend: formattedMonthlyTrend,
      recentNegative,
      responseRate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get admin reviews with filters
 * GET /reviews/admin/reviews
 */
export const getAdminReviews = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sellerId,
      productId, 
      sentiment, 
      rating,
      isVisible,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    
    // Build query
    const query = {};
    
    if (sellerId) {
      query.sellerId = new mongoose.Types.ObjectId(sellerId);
    }
    
    if (productId) {
      query.productId = new mongoose.Types.ObjectId(productId);
    }
    
    if (sentiment) {
      query.sentiment = sentiment;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    if (isVisible !== undefined) {
      query.isVisible = isVisible === 'true';
    }
    
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('productId', 'title imageUrl')
        .populate('userId', 'name profileImage')
        .populate('sellerId', 'name email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
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
 * Get admin reviews analytics
 * GET /reviews/admin/analytics
 */
export const getAdminReviewsAnalytics = async (req, res, next) => {
  try {
    // Overall platform stats
    const overallStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          positiveCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          neutralCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
          negativeCount: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          repliedCount: { $sum: { $cond: [{ $ne: ['$sellerReply', null] }, 1, 0] } },
          hiddenCount: { $sum: { $cond: [{ $eq: ['$isVisible', false] }, 1, 0] } }
        }
      }
    ]);
    
    const overall = overallStats.length > 0 ? overallStats[0] : {
      avgRating: 0,
      totalReviews: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      rating5: 0,
      rating4: 0,
      rating3: 0,
      rating2: 0,
      rating1: 0,
      repliedCount: 0,
      hiddenCount: 0
    };
    
    // Calculate seller response rate
    const sellerResponseRate = overall.totalReviews > 0 
      ? Math.round((overall.repliedCount / overall.totalReviews) * 100)
      : 0;
    
    // Calculate positive sentiment percentage
    const positiveSentimentPercentage = overall.totalReviews > 0
      ? Math.round((overall.positiveCount / overall.totalReviews) * 100)
      : 0;
    
    // Negative reviews in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentNegativeCount = await Review.countDocuments({
      sentiment: 'negative',
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Top performing products
    const topProducts = await Review.aggregate([
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } }
        }
      },
      { $match: { reviewCount: { $gte: 5 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'users',
          localField: 'product.sellerId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $project: {
          productId: '$_id',
          productName: '$product.title',
          sellerName: '$seller.name',
          avgRating: 1,
          reviewCount: 1,
          positivePercentage: { 
            $multiply: [{ $divide: ['$positive', '$reviewCount'] }, 100] 
          }
        }
      }
    ]);
    
    // Bottom performing products
    const bottomProducts = await Review.aggregate([
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
        }
      },
      { $match: { reviewCount: { $gte: 5 } } },
      { $sort: { avgRating: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'users',
          localField: 'product.sellerId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $project: {
          productId: '$_id',
          productName: '$product.title',
          sellerName: '$seller.name',
          sellerId: '$seller._id',
          avgRating: 1,
          reviewCount: 1,
          negativePercentage: { 
            $multiply: [{ $divide: ['$negative', '$reviewCount'] }, 100] 
          }
        }
      }
    ]);
    
    // Keyword analysis
    const allReviews = await Review.find({}).select('sentiment sentimentKeywordsMatched');
    const positiveKeywords = getKeywordFrequency(allReviews, 'positive').slice(0, 10);
    const negativeKeywords = getKeywordFrequency(allReviews, 'negative').slice(0, 10);
    
    // Monthly review volume (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const monthlyVolume = await Review.aggregate([
      { 
        $match: { 
          createdAt: { $gte: twelveMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format monthly volume
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyVolume = monthlyVolume.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));
    
    res.json({
      overall: {
        avgRating: Math.round(overall.avgRating * 10) / 10,
        totalReviews: overall.totalReviews,
        sentimentBreakdown: {
          positive: overall.positiveCount,
          neutral: overall.neutralCount,
          negative: overall.negativeCount
        },
        ratingBreakdown: {
          5: overall.rating5,
          4: overall.rating4,
          3: overall.rating3,
          2: overall.rating2,
          1: overall.rating1
        },
        hiddenReviews: overall.hiddenCount
      },
      recentNegativeCount,
      sellerResponseRate,
      topProducts,
      bottomProducts,
      keywordAnalysis: {
        positive: positiveKeywords,
        negative: negativeKeywords
      },
      monthlyVolume: formattedMonthlyVolume
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin hide/show review
 * PATCH /reviews/admin/:reviewId/visibility
 */
export const toggleReviewVisibility = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isVisible, adminNote } = req.body;
    const adminId = req.user.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    review.isVisible = isVisible;
    if (adminNote) {
      review.adminNote = adminNote;
    }
    review.moderatedBy = adminId;
    review.moderatedAt = new Date();
    
    await review.save();
    
    // Update product rating if visibility changed
    await updateProductRating(review.productId);
    
    res.json({ 
      message: `Review ${isVisible ? 'shown' : 'hidden'} successfully`,
      review 
    });
  } catch (error) {
    next(error);
  }
};
