import Review from '../models/Review.js';
import Order from '../models/Order.js';

/**
 * Middleware to check if user has pending reviews before placing new orders
 */
export const checkPendingReviewsBeforeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find delivered orders without reviews
    const deliveredOrders = await Order.find({
      buyerId: userId,
      status: 'DELIVERED'
    });
    
    let hasPendingReviews = false;
    
    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        const existingReview = await Review.findOne({
          userId,
          productId: item.productId
        });
        
        if (!existingReview) {
          hasPendingReviews = true;
          break;
        }
      }
      if (hasPendingReviews) break;
    }
    
    if (hasPendingReviews) {
      return res.status(400).json({
        error: 'Please complete reviews for your delivered orders before placing a new order',
        requiresReview: true,
        redirectTo: '/reviews/pending'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking pending reviews:', error);
    next(); // Continue with order creation if check fails
  }
};