import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Get seller dashboard stats
 * GET /api/seller/dashboard
 */
export const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user.id;

    // Get seller's products
    const products = await Product.find({ sellerId });
    const productIds = products.map(p => p._id);

    // Get seller's orders
    const orders = await Order.find({
      'orderItems.sellerId': sellerId,
    })
      .populate([
        { path: 'buyerId', select: '_id name email' },
        { path: 'orderItems.productId', select: '_id title imageUrl price' },
      ])
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalProducts = products.length;
    const totalOrders = orders.length;

    // Calculate revenue (only from delivered orders)
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    const totalRevenue = deliveredOrders.reduce((sum, order) => {
      // Calculate revenue only from seller's products in each order
      const sellerItemsTotal = order.orderItems
        .filter(item => item.sellerId.toString() === sellerId.toString())
        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      return sum + sellerItemsTotal;
    }, 0);

    // Order status counts
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const processingOrders = orders.filter(o => o.status === 'PROCESSING').length;
    const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      buyerId: order.buyerId,
      orderItems: order.orderItems.filter(item => 
        item.sellerId.toString() === sellerId.toString()
      ),
      totalAmount: order.orderItems
        .filter(item => item.sellerId.toString() === sellerId.toString())
        .reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    }));

    // Top selling products
    const productSales = {};
    orders.forEach(order => {
      order.orderItems
        .filter(item => item.sellerId.toString() === sellerId.toString())
        .forEach(item => {
          const productId = item.productId._id.toString();
          if (!productSales[productId]) {
            productSales[productId] = {
              product: item.productId,
              totalSold: 0,
              revenue: 0,
            };
          }
          productSales[productId].totalSold += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Low stock products
    const lowStockProducts = products
      .filter(p => p.stock < 10 && p.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        title: p.title,
        stock: p.stock,
        imageUrl: p.imageUrl,
        price: p.price,
      }));

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        cancelledOrders,
      },
      recentOrders,
      topProducts,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};
