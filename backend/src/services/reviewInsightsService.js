import Review from '../models/Review.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * Generate insights for a specific product
 */
export const generateProductInsights = async (productId) => {
  try {
    const [reviews, product] = await Promise.all([
      Review.find({ productId }).populate('userId', 'name'),
      Product.findById(productId)
    ]);

    if (!product || reviews.length === 0) {
      return { insights: [], recommendations: [] };
    }

    const insights = [];
    const recommendations = [];

    // Rating trend analysis
    const ratingTrend = analyzeRatingTrend(reviews);
    if (ratingTrend.trend === 'declining') {
      insights.push({
        type: 'warning',
        title: 'Declining Rating Trend',
        description: `Average rating has decreased by ${ratingTrend.change.toFixed(1)} stars over the last 30 days`,
        impact: 'high'
      });
      recommendations.push({
        type: 'quality',
        priority: 'high',
        action: 'Review recent negative feedback and address common quality issues'
      });
    }

    // Sentiment analysis insights
    const sentimentInsights = analyzeSentimentPatterns(reviews);
    if (sentimentInsights.negativePercentage > 30) {
      insights.push({
        type: 'alert',
        title: 'High Negative Sentiment',
        description: `${sentimentInsights.negativePercentage}% of reviews have negative sentiment`,
        impact: 'high'
      });
    }

    // Common complaint analysis
    const complaints = extractCommonComplaints(reviews);
    if (complaints.length > 0) {
      insights.push({
        type: 'info',
        title: 'Common Customer Concerns',
        description: `Top issues: ${complaints.slice(0, 3).join(', ')}`,
        impact: 'medium'
      });
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        action: `Address common complaints: ${complaints[0]}`
      });
    }

    // Review velocity analysis
    const reviewVelocity = analyzeReviewVelocity(reviews);
    if (reviewVelocity.trend === 'decreasing') {
      insights.push({
        type: 'warning',
        title: 'Decreasing Review Activity',
        description: 'Fewer customers are leaving reviews recently',
        impact: 'low'
      });
      recommendations.push({
        type: 'engagement',
        priority: 'low',
        action: 'Implement review incentive program or follow-up emails'
      });
    }

    // Competitive analysis
    const competitiveInsights = await generateCompetitiveInsights(product);
    insights.push(...competitiveInsights.insights);
    recommendations.push(...competitiveInsights.recommendations);

    return { insights, recommendations };
  } catch (error) {
    console.error('Error generating product insights:', error);
    return { insights: [], recommendations: [] };
  }
};

/**
 * Analyze rating trend over time
 */
const analyzeRatingTrend = (reviews) => {
  const sortedReviews = reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const recentReviews = sortedReviews.filter(r => new Date(r.createdAt) > thirtyDaysAgo);
  const olderReviews = sortedReviews.filter(r => new Date(r.createdAt) <= thirtyDaysAgo);
  
  if (recentReviews.length === 0 || olderReviews.length === 0) {
    return { trend: 'stable', change: 0 };
  }
  
  const recentAvg = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
  const olderAvg = olderReviews.reduce((sum, r) => sum + r.rating, 0) / olderReviews.length;
  
  const change = recentAvg - olderAvg;
  
  return {
    trend: change < -0.3 ? 'declining' : change > 0.3 ? 'improving' : 'stable',
    change: Math.abs(change),
    recentAverage: recentAvg,
    previousAverage: olderAvg
  };
};

/**
 * Analyze sentiment patterns
 */
const analyzeSentimentPatterns = (reviews) => {
  const sentimentCounts = reviews.reduce((acc, review) => {
    acc[review.sentiment] = (acc[review.sentiment] || 0) + 1;
    return acc;
  }, {});
  
  const total = reviews.length;
  
  return {
    positivePercentage: Math.round((sentimentCounts.positive || 0) / total * 100),
    negativePercentage: Math.round((sentimentCounts.negative || 0) / total * 100),
    neutralPercentage: Math.round((sentimentCounts.neutral || 0) / total * 100),
    distribution: sentimentCounts
  };
};

/**
 * Extract common complaints from negative reviews
 */
const extractCommonComplaints = (reviews) => {
  const negativeReviews = reviews.filter(r => r.rating <= 2 || r.sentiment === 'negative');
  
  const complaintKeywords = {
    'packaging': ['packaging', 'package', 'box', 'container', 'bottle'],
    'delivery': ['delivery', 'shipping', 'arrived', 'late', 'delayed'],
    'quality': ['quality', 'cheap', 'poor', 'bad quality', 'defective'],
    'effectiveness': ['not working', 'ineffective', 'no results', 'waste'],
    'scent': ['smell', 'scent', 'fragrance', 'odor', 'stinks'],
    'texture': ['texture', 'consistency', 'thick', 'thin', 'greasy'],
    'irritation': ['irritation', 'burning', 'stinging', 'rash', 'allergic'],
    'price': ['expensive', 'overpriced', 'costly', 'price', 'money']
  };
  
  const complaintCounts = {};
  
  negativeReviews.forEach(review => {
    const comment = review.comment.toLowerCase();
    Object.entries(complaintKeywords).forEach(([complaint, keywords]) => {
      if (keywords.some(keyword => comment.includes(keyword))) {
        complaintCounts[complaint] = (complaintCounts[complaint] || 0) + 1;
      }
    });
  });
  
  return Object.entries(complaintCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([complaint]) => complaint);
};

/**
 * Analyze review velocity (frequency of reviews over time)
 */
const analyzeReviewVelocity = (reviews) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  
  const recentCount = reviews.filter(r => new Date(r.createdAt) > thirtyDaysAgo).length;
  const previousCount = reviews.filter(r => 
    new Date(r.createdAt) > sixtyDaysAgo && new Date(r.createdAt) <= thirtyDaysAgo
  ).length;
  
  const change = recentCount - previousCount;
  
  return {
    trend: change < -2 ? 'decreasing' : change > 2 ? 'increasing' : 'stable',
    recentCount,
    previousCount,
    change
  };
};

/**
 * Generate competitive insights
 */
const generateCompetitiveInsights = async (product) => {
  try {
    const categoryProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      totalReviews: { $gte: 5 }
    }).select('averageRating totalReviews price');
    
    if (categoryProducts.length === 0) {
      return { insights: [], recommendations: [] };
    }
    
    const categoryAvgRating = categoryProducts.reduce((sum, p) => sum + p.averageRating, 0) / categoryProducts.length;
    const categoryAvgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;
    
    const insights = [];
    const recommendations = [];
    
    // Rating comparison
    if (product.averageRating < categoryAvgRating - 0.5) {
      insights.push({
        type: 'competitive',
        title: 'Below Category Average',
        description: `Product rating (${product.averageRating}) is ${(categoryAvgRating - product.averageRating).toFixed(1)} stars below category average`,
        impact: 'high'
      });
      recommendations.push({
        type: 'competitive',
        priority: 'high',
        action: 'Analyze top-rated competitors to identify improvement opportunities'
      });
    }
    
    // Price positioning
    const pricePosition = product.price > categoryAvgPrice ? 'premium' : 'value';
    if (pricePosition === 'premium' && product.averageRating < categoryAvgRating) {
      insights.push({
        type: 'pricing',
        title: 'Premium Price, Average Rating',
        description: 'Higher price point may not be justified by current rating',
        impact: 'medium'
      });
      recommendations.push({
        type: 'pricing',
        priority: 'medium',
        action: 'Consider price adjustment or focus on premium quality improvements'
      });
    }
    
    return { insights, recommendations };
  } catch (error) {
    console.error('Error generating competitive insights:', error);
    return { insights: [], recommendations: [] };
  }
};

/**
 * Generate seller performance insights
 */
export const generateSellerInsights = async (sellerId) => {
  try {
    const [reviews, products] = await Promise.all([
      Review.find({ sellerId }).populate('productId', 'title category'),
      Product.find({ sellerId }).select('title averageRating totalReviews category status')
    ]);
    
    const insights = [];
    const recommendations = [];
    
    // Overall performance
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const responseRate = calculateResponseRate(reviews);
    
    if (avgRating < 4.0) {
      insights.push({
        type: 'performance',
        title: 'Overall Rating Below Target',
        description: `Average rating across all products: ${avgRating.toFixed(1)}/5.0`,
        impact: 'high'
      });
    }
    
    // Category performance
    const categoryPerformance = analyzeCategoryPerformance(reviews);
    const worstCategory = Object.entries(categoryPerformance)
      .sort(([,a], [,b]) => a.avgRating - b.avgRating)[0];
    
    if (worstCategory && worstCategory[1].avgRating < 3.5) {
      insights.push({
        type: 'category',
        title: `${worstCategory[0]} Category Underperforming`,
        description: `Average rating: ${worstCategory[1].avgRating.toFixed(1)}/5.0`,
        impact: 'medium'
      });
      recommendations.push({
        type: 'category',
        priority: 'medium',
        action: `Focus on improving ${worstCategory[0]} product quality and customer satisfaction`
      });
    }
    
    // Product portfolio analysis
    const flaggedProducts = products.filter(p => p.status !== 'healthy');
    if (flaggedProducts.length > 0) {
      insights.push({
        type: 'portfolio',
        title: 'Products Requiring Attention',
        description: `${flaggedProducts.length} products flagged for poor performance`,
        impact: 'high'
      });
      recommendations.push({
        type: 'portfolio',
        priority: 'high',
        action: 'Review and improve flagged products or consider discontinuation'
      });
    }
    
    return { insights, recommendations, stats: { avgRating, responseRate } };
  } catch (error) {
    console.error('Error generating seller insights:', error);
    return { insights: [], recommendations: [], stats: {} };
  }
};

/**
 * Calculate response rate (placeholder - would need response tracking)
 */
const calculateResponseRate = (reviews) => {
  // In a real implementation, this would calculate the percentage of reviews
  // that received a response from the seller
  return Math.random() * 100; // Placeholder
};

/**
 * Analyze performance by category
 */
const analyzeCategoryPerformance = (reviews) => {
  const categoryStats = {};
  
  reviews.forEach(review => {
    const category = review.productId?.category || 'uncategorized';
    if (!categoryStats[category]) {
      categoryStats[category] = { ratings: [], count: 0 };
    }
    categoryStats[category].ratings.push(review.rating);
    categoryStats[category].count++;
  });
  
  Object.keys(categoryStats).forEach(category => {
    const ratings = categoryStats[category].ratings;
    categoryStats[category].avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  });
  
  return categoryStats;
};