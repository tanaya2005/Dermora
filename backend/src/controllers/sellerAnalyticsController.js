import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Get seller analytics data
 * GET /api/seller/analytics
 */
export const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user.id;

    // Get all seller's products
    const sellerProducts = await Product.find({ sellerId });
    const productIds = sellerProducts.map(p => p._id);

    if (productIds.length === 0) {
      return res.json({
        summary: {
          totalSearches: 0,
          totalClicks: 0,
          totalAddToCart: 0,
          totalPurchases: 0,
        },
        monthlyRevenue: [],
        topProducts: {
          searched: [],
          clicked: [],
          addedToCart: [],
          purchased: [],
        },
        categoryData: [],
      });
    }

    // Get all orders containing seller's products
    const orders = await Order.find({
      'orderItems.sellerId': sellerId,
      status: { $ne: 'CANCELLED' },
    }).populate('orderItems.productId');

    // Calculate summary stats
    const summary = {
      totalSearches: sellerProducts.reduce((sum, p) => sum + (p.searchCount || 0), 0),
      totalClicks: sellerProducts.reduce((sum, p) => sum + (p.clickCount || 0), 0),
      totalAddToCart: sellerProducts.reduce((sum, p) => sum + (p.addToCartCount || 0), 0),
      totalPurchases: 0,
    };

    // Calculate monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = { month: monthKey, revenue: 0, orders: 0 };
    }

    // Process orders
    const productSalesMap = {};
    const categoryRevenueMap = {};

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= sixMonthsAgo) {
        const monthKey = monthNames[orderDate.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].orders += 1;
        }
      }

      order.orderItems.forEach(item => {
        if (item.sellerId.toString() === sellerId.toString()) {
          const itemTotal = item.price * item.quantity;
          summary.totalPurchases += item.quantity;

          // Add to monthly revenue
          if (orderDate >= sixMonthsAgo) {
            const monthKey = monthNames[orderDate.getMonth()];
            if (monthlyData[monthKey]) {
              monthlyData[monthKey].revenue += itemTotal;
            }
          }

          // Track product sales
          const productId = item.productId._id.toString();
          if (!productSalesMap[productId]) {
            productSalesMap[productId] = {
              product: item.productId,
              sales: 0,
              revenue: 0,
            };
          }
          productSalesMap[productId].sales += item.quantity;
          productSalesMap[productId].revenue += itemTotal;

          // Track category revenue
          const category = item.productId.category || 'Other';
          if (!categoryRevenueMap[category]) {
            categoryRevenueMap[category] = 0;
          }
          categoryRevenueMap[category] += itemTotal;
        }
      });
    });

    // Convert monthly data to array
    const monthlyRevenue = Object.values(monthlyData);

    // Get top products by different metrics
    const topProductsByPurchase = sellerProducts
      .map(p => {
        const salesData = productSalesMap[p._id.toString()] || { sales: 0, revenue: 0 };
        return {
          _id: p._id,
          title: p.title,
          imageUrl: p.imageUrl,
          searchCount: p.searchCount || 0,
          clickCount: p.clickCount || 0,
          addToCartCount: p.addToCartCount || 0,
          purchaseCount: salesData.sales,
          revenue: salesData.revenue,
        };
      })
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 10);

    const topProductsBySearch = [...topProductsByPurchase]
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, 10);

    const topProductsByClick = [...topProductsByPurchase]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10);

    const topProductsByCart = [...topProductsByPurchase]
      .sort((a, b) => b.addToCartCount - a.addToCartCount)
      .slice(0, 10);

    // Calculate category percentages
    const totalRevenue = Object.values(categoryRevenueMap).reduce((sum, val) => sum + val, 0);
    const categoryData = Object.entries(categoryRevenueMap)
      .map(([name, revenue]) => ({
        name,
        value: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json({
      summary,
      monthlyRevenue,
      topProducts: {
        searched: topProductsBySearch,
        clicked: topProductsByClick,
        addedToCart: topProductsByCart,
        purchased: topProductsByPurchase,
      },
      categoryData,
    });
  } catch (error) {
    next(error);
  }
};
