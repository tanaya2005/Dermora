import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Handle low rating customer retention
 */
export const handleLowRatingRetention = async (userId, productId, rating) => {
  if (rating > 2) return null;
  
  try {
    const [user, product, alternatives] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
      // Find alternative products in same category with better ratings
      Product.find({
        category: { $exists: true },
        _id: { $ne: productId },
        averageRating: { $gte: 4 },
        status: 'healthy'
      }).limit(3).sort({ averageRating: -1 })
    ]);
    
    if (!user || !product) return null;
    
    const retentionStrategy = {
      userId,
      productId,
      rating,
      strategies: []
    };
    
    // Strategy 1: Alternative product suggestions
    if (alternatives.length > 0) {
      retentionStrategy.strategies.push({
        type: 'alternative_products',
        title: 'Try These Highly Rated Alternatives',
        message: `We're sorry ${product.title} didn't meet your expectations. Here are some highly-rated alternatives in the same category:`,
        products: alternatives.map(alt => ({
          id: alt._id,
          title: alt.title,
          averageRating: alt.averageRating,
          price: alt.price,
          imageUrl: alt.imageUrl
        }))
      });
    }
    
    // Strategy 2: Discount coupon
    const discountPercentage = rating === 1 ? 20 : 15;
    retentionStrategy.strategies.push({
      type: 'discount_coupon',
      title: `${discountPercentage}% Off Your Next Purchase`,
      message: `We value your feedback! Here's a ${discountPercentage}% discount code for your next order.`,
      couponCode: `SORRY${discountPercentage}${Date.now().toString().slice(-4)}`,
      discountPercentage,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // Strategy 3: Dermatologist consultation (for skincare products)
    if (product.category && ['cleanser', 'moisturizer', 'serum', 'treatment'].includes(product.category.toLowerCase())) {
      retentionStrategy.strategies.push({
        type: 'dermatologist_consultation',
        title: 'Free Dermatologist Consultation',
        message: 'Get personalized skincare advice from our certified dermatologists to find products that work better for your skin type.',
        consultationLink: '/consult-dermatologist',
        isFree: true
      });
    }
    
    // Strategy 4: Personalized recommendations based on skin profile
    if (user.skinProfile && user.skinProfile.assessmentCompleted) {
      const personalizedProducts = await Product.find({
        category: { $in: user.skinProfile.preferredCategories || [] },
        averageRating: { $gte: 4 },
        status: 'healthy',
        _id: { $ne: productId }
      }).limit(2);
      
      if (personalizedProducts.length > 0) {
        retentionStrategy.strategies.push({
          type: 'personalized_recommendations',
          title: 'Products Matched to Your Skin Profile',
          message: 'Based on your skin assessment, these products might work better for you:',
          products: personalizedProducts.map(prod => ({
            id: prod._id,
            title: prod.title,
            averageRating: prod.averageRating,
            price: prod.price,
            imageUrl: prod.imageUrl,
            matchReason: `Suitable for ${user.skinProfile.skinType} skin`
          }))
        });
      }
    }
    
    return retentionStrategy;
  } catch (error) {
    console.error('Error handling low rating retention:', error);
    return null;
  }
};

/**
 * Get customer retention insights for admin
 */
export const getRetentionInsights = async () => {
  try {
    const [lowRatingStats, retentionMetrics, riskCustomers] = await Promise.all([
      // Low rating statistics
      Review.aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            lowRatings: { $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] } },
            averageRating: { $avg: '$rating' }
          }
        }
      ]),
      
      // Customer retention metrics
      mongoose.connection.db.collection('orders').aggregate([
        {
          $group: {
            _id: '$buyerId',
            orderCount: { $sum: 1 },
            firstOrder: { $min: '$createdAt' },
            lastOrder: { $max: '$createdAt' }
          }
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            repeatCustomers: { $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] } },
            averageOrders: { $avg: '$orderCount' }
          }
        }
      ]).toArray(),
      
      // At-risk customers (low ratings, no recent orders)
      Review.aggregate([
        { $match: { rating: { $lte: 2 } } },
        {
          $lookup: {
            from: 'orders',
            localField: 'userId',
            foreignField: 'buyerId',
            as: 'orders'
          }
        },
        {
          $addFields: {
            lastOrderDate: { $max: '$orders.createdAt' }
          }
        },
        {
          $match: {
            lastOrderDate: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 days ago
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: 1,
            userName: '$user.name',
            userEmail: '$user.email',
            rating: 1,
            comment: 1,
            lastOrderDate: 1,
            productId: 1
          }
        },
        { $limit: 20 }
      ])
    ]);
    
    const retentionRate = retentionMetrics.length > 0 
      ? (retentionMetrics[0].repeatCustomers / retentionMetrics[0].totalCustomers) * 100
      : 0;
    
    const lowRatingRate = lowRatingStats.length > 0
      ? (lowRatingStats[0].lowRatings / lowRatingStats[0].totalReviews) * 100
      : 0;
    
    return {
      overview: {
        retentionRate: Math.round(retentionRate),
        lowRatingRate: Math.round(lowRatingRate),
        totalCustomers: retentionMetrics.length > 0 ? retentionMetrics[0].totalCustomers : 0,
        repeatCustomers: retentionMetrics.length > 0 ? retentionMetrics[0].repeatCustomers : 0,
        averageOrders: retentionMetrics.length > 0 ? retentionMetrics[0].averageOrders : 0
      },
      riskCustomers,
      recommendations: generateRetentionRecommendations(retentionRate, lowRatingRate)
    };
  } catch (error) {
    console.error('Error getting retention insights:', error);
    return null;
  }
};

/**
 * Generate retention improvement recommendations
 */
const generateRetentionRecommendations = (retentionRate, lowRatingRate) => {
  const recommendations = [];
  
  if (retentionRate < 30) {
    recommendations.push({
      type: 'retention',
      priority: 'high',
      message: 'Low customer retention rate. Implement loyalty programs and follow-up campaigns.'
    });
  }
  
  if (lowRatingRate > 20) {
    recommendations.push({
      type: 'quality',
      priority: 'high',
      message: 'High percentage of low ratings. Focus on product quality improvements and customer service.'
    });
  }
  
  recommendations.push({
    type: 'engagement',
    priority: 'medium',
    message: 'Implement automated retention campaigns for customers who leave low ratings.'
  });
  
  return recommendations;
};