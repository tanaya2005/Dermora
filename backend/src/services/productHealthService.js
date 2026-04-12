import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Calculate product health score
 * Formula: (averageRating * 20) + (repeatPurchaseRate * 30) - (returnRate * 50)
 */
export const calculateHealthScore = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return 0;
    
    // Get review stats
    const reviewStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = reviewStats.length > 0 ? reviewStats[0].averageRating : 0;
    
    // Calculate repeat purchase rate (simplified - users who bought more than once)
    const repeatPurchases = await mongoose.connection.db.collection('orders').aggregate([
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.productId': new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$buyerId', purchaseCount: { $sum: 1 } } },
      { $match: { purchaseCount: { $gt: 1 } } },
      { $count: 'repeatCustomers' }
    ]).toArray();
    
    const totalCustomers = await mongoose.connection.db.collection('orders').aggregate([
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.productId': new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$buyerId' } },
      { $count: 'totalCustomers' }
    ]).toArray();
    
    const repeatPurchaseRate = totalCustomers.length > 0 
      ? (repeatPurchases.length > 0 ? repeatPurchases[0].repeatCustomers : 0) / totalCustomers[0].totalCustomers
      : 0;
    
    // Simplified return rate (negative reviews as proxy)
    const returnRate = product.negativePercentage / 100;
    
    // Calculate health score
    const healthScore = Math.max(0, Math.min(100, 
      (averageRating * 20) + (repeatPurchaseRate * 30) - (returnRate * 50)
    ));
    
    // Update product
    await Product.findByIdAndUpdate(productId, { healthScore });
    
    return healthScore;
  } catch (error) {
    console.error('Error calculating health score:', error);
    return 0;
  }
};

/**
 * Check for flagged products and send alerts
 */
export const checkProductHealth = async () => {
  try {
    const flaggedProducts = await Product.find({
      status: { $in: ['warning', 'critical'] }
    }).populate('sellerId', 'name email');
    
    const alerts = [];
    
    for (const product of flaggedProducts) {
      const alert = {
        productId: product._id,
        productName: product.title,
        sellerId: product.sellerId._id,
        sellerName: product.sellerId.name,
        sellerEmail: product.sellerId.email,
        status: product.status,
        averageRating: product.averageRating,
        negativePercentage: product.negativePercentage,
        message: `Product "${product.title}" is underperforming. Review feedback and take action.`,
        severity: product.status === 'critical' ? 'high' : 'medium',
        createdAt: new Date()
      };
      
      alerts.push(alert);
    }
    
    return alerts;
  } catch (error) {
    console.error('Error checking product health:', error);
    return [];
  }
};

/**
 * Get product performance insights
 */
export const getProductInsights = async (productId) => {
  try {
    const [product, reviewInsights, competitorAnalysis] = await Promise.all([
      Product.findById(productId),
      
      // Review insights
      Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            sentimentBreakdown: {
              $push: '$sentiment'
            },
            ratingBreakdown: {
              $push: '$rating'
            }
          }
        }
      ]),
      
      // Competitor analysis (same category)
      Product.aggregate([
        { 
          $match: { 
            category: { $exists: true },
            _id: { $ne: new mongoose.Types.ObjectId(productId) }
          }
        },
        {
          $group: {
            _id: '$category',
            avgRating: { $avg: '$averageRating' },
            avgPrice: { $avg: '$price' },
            productCount: { $sum: 1 }
          }
        }
      ])
    ]);
    
    if (!product) return null;
    
    // Process sentiment breakdown
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (reviewInsights.length > 0) {
      reviewInsights[0].sentimentBreakdown.forEach(sentiment => {
        sentimentCounts[sentiment]++;
      });
      
      reviewInsights[0].ratingBreakdown.forEach(rating => {
        ratingCounts[rating]++;
      });
    }
    
    // Find category benchmark
    const categoryBenchmark = competitorAnalysis.find(cat => cat._id === product.category);
    
    return {
      product: {
        id: product._id,
        title: product.title,
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        status: product.status,
        healthScore: product.healthScore,
        price: product.price
      },
      insights: {
        sentimentBreakdown: sentimentCounts,
        ratingBreakdown: ratingCounts,
        categoryBenchmark: categoryBenchmark || null,
        recommendations: generateRecommendations(product, sentimentCounts, categoryBenchmark)
      }
    };
  } catch (error) {
    console.error('Error getting product insights:', error);
    return null;
  }
};

/**
 * Generate improvement recommendations
 */
const generateRecommendations = (product, sentimentCounts, categoryBenchmark) => {
  const recommendations = [];
  
  if (product.averageRating < 3) {
    recommendations.push({
      type: 'quality',
      priority: 'high',
      message: 'Product rating is below 3. Consider reviewing product quality and addressing common complaints.'
    });
  }
  
  if (sentimentCounts.negative > sentimentCounts.positive) {
    recommendations.push({
      type: 'feedback',
      priority: 'high',
      message: 'More negative than positive reviews. Analyze negative feedback patterns and improve product accordingly.'
    });
  }
  
  if (categoryBenchmark && product.averageRating < categoryBenchmark.avgRating) {
    recommendations.push({
      type: 'competitive',
      priority: 'medium',
      message: `Product rating (${product.averageRating}) is below category average (${categoryBenchmark.avgRating.toFixed(1)}). Research competitor products for improvement ideas.`
    });
  }
  
  if (product.totalReviews < 5) {
    recommendations.push({
      type: 'engagement',
      priority: 'low',
      message: 'Low review count. Consider encouraging customers to leave reviews through follow-up communications.'
    });
  }
  
  return recommendations;
};