import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * Get analytics for a seller
 * GET /analytics/seller
 */
export const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user.id;

    // Get all products of this seller
    const products = await Product.find({ sellerId });

    const totalClicks = products.reduce((sum, p) => sum + (p.clickCount || 0), 0);
    const totalSearches = products.reduce((sum, p) => sum + (p.searchCount || 0), 0);
    const totalAddToCart = products.reduce((sum, p) => sum + (p.addToCartCount || 0), 0);
    const totalPurchases = products.reduce((sum, p) => sum + (p.purchaseCount || 0), 0);

    // Get top performing products for this seller
    const topSearched = await Product.find({ sellerId }).sort({ searchCount: -1 }).limit(5);
    const topClicked = await Product.find({ sellerId }).sort({ clickCount: -1 }).limit(5);
    const topAddedToCart = await Product.find({ sellerId }).sort({ addToCartCount: -1 }).limit(5);
    const topPurchased = await Product.find({ sellerId }).sort({ purchaseCount: -1 }).limit(5);

    res.json({
      summary: {
        totalClicks,
        totalSearches,
        totalAddToCart,
        totalPurchases,
      },
      topProducts: {
        searched: topSearched,
        clicked: topClicked,
        addedToCart: topAddedToCart,
        purchased: topPurchased,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics for admin
 * GET /analytics/admin
 */
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const products = await Product.find();

    const totalClicks = products.reduce((sum, p) => sum + (p.clickCount || 0), 0);
    const totalSearches = products.reduce((sum, p) => sum + (p.searchCount || 0), 0);
    const totalAddToCart = products.reduce((sum, p) => sum + (p.addToCartCount || 0), 0);
    const totalPurchases = products.reduce((sum, p) => sum + (p.purchaseCount || 0), 0);

    // Get top performing products across all sellers
    const topSearched = await Product.find().sort({ searchCount: -1 }).limit(10).populate('sellerId', 'name');
    const topClicked = await Product.find().sort({ clickCount: -1 }).limit(10).populate('sellerId', 'name');
    const topAddedToCart = await Product.find().sort({ addToCartCount: -1 }).limit(10).populate('sellerId', 'name');
    const topPurchased = await Product.find().sort({ purchaseCount: -1 }).limit(10).populate('sellerId', 'name');

    res.json({
      summary: {
        totalClicks,
        totalSearches,
        totalAddToCart,
        totalPurchases,
      },
      topProducts: {
        searched: topSearched,
        clicked: topClicked,
        addedToCart: topAddedToCart,
        purchased: topPurchased,
      }
    });
  } catch (error) {
    next(error);
  }
};
