// Email notification service for review-related events
// In production, integrate with services like SendGrid, Mailgun, or AWS SES

/**
 * Send email notification for new review
 */
export const sendNewReviewNotification = async (review, product, seller) => {
  try {
    const emailData = {
      to: seller.email,
      subject: `New Review for ${product.title}`,
      template: 'new-review',
      data: {
        sellerName: seller.name,
        productTitle: product.title,
        reviewerName: review.userId.name,
        rating: review.rating,
        comment: review.comment,
        reviewDate: review.createdAt.toLocaleDateString(),
        productUrl: `${process.env.FRONTEND_URL}/products/${product._id}`,
        dashboardUrl: `${process.env.FRONTEND_URL}/seller/reviews`
      }
    };

    // In production, replace with actual email service
    console.log('📧 New Review Email:', emailData);
    
    // Example with SendGrid:
    // await sendGridClient.send(emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send new review notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification for low rating review
 */
export const sendLowRatingAlert = async (review, product, seller) => {
  try {
    if (review.rating > 2) return { success: true }; // Only for ratings 1-2

    const emailData = {
      to: seller.email,
      subject: `⚠️ Low Rating Alert for ${product.title}`,
      template: 'low-rating-alert',
      data: {
        sellerName: seller.name,
        productTitle: product.title,
        rating: review.rating,
        comment: review.comment,
        reviewDate: review.createdAt.toLocaleDateString(),
        productUrl: `${process.env.FRONTEND_URL}/products/${product._id}`,
        dashboardUrl: `${process.env.FRONTEND_URL}/seller/reviews`,
        supportUrl: `${process.env.FRONTEND_URL}/seller/support`
      }
    };

    console.log('⚠️ Low Rating Alert Email:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send low rating alert:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification for product flagged as critical
 */
export const sendProductFlaggedNotification = async (product, seller) => {
  try {
    const emailData = {
      to: seller.email,
      subject: `🚨 Product Flagged: ${product.title}`,
      template: 'product-flagged',
      data: {
        sellerName: seller.name,
        productTitle: product.title,
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        status: product.status,
        productUrl: `${process.env.FRONTEND_URL}/products/${product._id}`,
        dashboardUrl: `${process.env.FRONTEND_URL}/seller/reviews`,
        improvementTips: [
          'Review recent negative feedback for common issues',
          'Consider updating product description or images',
          'Reach out to customers who left low ratings',
          'Evaluate product quality and manufacturing process'
        ]
      }
    };

    console.log('🚨 Product Flagged Email:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send product flagged notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send review reminder to customers
 */
export const sendReviewReminder = async (user, order, products) => {
  try {
    const emailData = {
      to: user.email,
      subject: 'How was your Dermora experience? Leave a review!',
      template: 'review-reminder',
      data: {
        customerName: user.name,
        orderNumber: order._id.toString().slice(-8).toUpperCase(),
        orderDate: order.createdAt.toLocaleDateString(),
        products: products.map(product => ({
          title: product.title,
          imageUrl: product.imageUrl,
          reviewUrl: `${process.env.FRONTEND_URL}/products/${product._id}#reviews`
        })),
        reviewsUrl: `${process.env.FRONTEND_URL}/reviews/pending`,
        incentive: 'Get 10% off your next order when you leave a review!'
      }
    };

    console.log('📝 Review Reminder Email:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send review reminder:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send admin notification for reported review
 */
export const sendReportedReviewNotification = async (review, reporter, reason) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dermora.com';
    
    const emailData = {
      to: adminEmail,
      subject: `Review Reported: Requires Moderation`,
      template: 'reported-review',
      data: {
        reviewId: review._id,
        productTitle: review.productId.title,
        reviewerName: review.userId.name,
        reporterName: reporter.name,
        reportReason: reason,
        reviewContent: review.comment,
        rating: review.rating,
        reportedAt: new Date().toLocaleDateString(),
        moderationUrl: `${process.env.FRONTEND_URL}/admin/reviews/moderation`
      }
    };

    console.log('🚨 Reported Review Email:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send reported review notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send weekly review digest to sellers
 */
export const sendWeeklyReviewDigest = async (seller, reviewStats, recentReviews) => {
  try {
    const emailData = {
      to: seller.email,
      subject: 'Your Weekly Review Digest - Dermora',
      template: 'weekly-digest',
      data: {
        sellerName: seller.name,
        weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        weekEnd: new Date().toLocaleDateString(),
        stats: {
          totalReviews: reviewStats.totalReviews,
          averageRating: reviewStats.averageRating,
          positiveReviews: reviewStats.positiveReviews,
          negativeReviews: reviewStats.negativeReviews
        },
        recentReviews: recentReviews.slice(0, 5).map(review => ({
          productTitle: review.productId.title,
          rating: review.rating,
          comment: review.comment.substring(0, 100) + '...',
          reviewerName: review.userId.name,
          date: review.createdAt.toLocaleDateString()
        })),
        dashboardUrl: `${process.env.FRONTEND_URL}/seller/reviews`,
        tipsUrl: `${process.env.FRONTEND_URL}/seller/help/review-tips`
      }
    };

    console.log('📊 Weekly Digest Email:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send weekly digest:', error);
    return { success: false, error: error.message };
  }
};

// Email templates (in production, these would be HTML templates)
export const emailTemplates = {
  'new-review': {
    subject: 'New Review for {{productTitle}}',
    html: `
      <h2>New Review Received!</h2>
      <p>Hi {{sellerName}},</p>
      <p>You've received a new review for <strong>{{productTitle}}</strong>:</p>
      <div style="border-left: 4px solid #c97d5e; padding-left: 16px; margin: 16px 0;">
        <p><strong>Rating:</strong> {{rating}}/5 stars</p>
        <p><strong>Review:</strong> "{{comment}}"</p>
        <p><strong>Reviewer:</strong> {{reviewerName}}</p>
        <p><strong>Date:</strong> {{reviewDate}}</p>
      </div>
      <p><a href="{{dashboardUrl}}" style="background: #c97d5e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View All Reviews</a></p>
    `
  },
  
  'low-rating-alert': {
    subject: '⚠️ Low Rating Alert for {{productTitle}}',
    html: `
      <h2>Low Rating Alert</h2>
      <p>Hi {{sellerName}},</p>
      <p>Your product <strong>{{productTitle}}</strong> received a low rating that may need attention:</p>
      <div style="border-left: 4px solid #ef4444; padding-left: 16px; margin: 16px 0;">
        <p><strong>Rating:</strong> {{rating}}/5 stars</p>
        <p><strong>Review:</strong> "{{comment}}"</p>
        <p><strong>Date:</strong> {{reviewDate}}</p>
      </div>
      <p>Consider reaching out to the customer or reviewing your product quality.</p>
      <p><a href="{{dashboardUrl}}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Reviews Dashboard</a></p>
    `
  }
};