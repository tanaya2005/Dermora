import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { createOrderSchema } from '../validators/index.js';

/**
 * Create new order
 * POST /orders/create
 */
export const createOrder = async (req, res, next) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    // Fetch products and validate stock
    const productIds = validatedData.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({ error: 'One or more products not found' });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of validatedData.items) {
      const product = products.find(p => p._id.toString() === item.productId);

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.title}` 
        });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = await Order.create({
      buyerId: req.user.id,
      totalAmount,
      status: 'PENDING',
      orderItems,
    });

    // Update product analytics and stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 
          purchaseCount: 1,
          stock: -item.quantity 
        }
      });
    }

    await order.populate([
      { path: 'orderItems.productId', select: 'id title imageUrl' },
      { path: 'buyerId', select: 'id name email' },
    ]);

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's orders
 * GET /orders/user
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('orderItems.productId', '_id title imageUrl price')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Get seller's orders
 * GET /orders/seller
 */
export const getSellerOrders = async (req, res, next) => {
  try {
    console.log('=== GET SELLER ORDERS ===');
    console.log('Seller ID from req.user:', req.user.id, 'Type:', typeof req.user.id);
    
    const orders = await Order.find({
      'orderItems.sellerId': req.user.id,
    })
      .populate([
        { path: 'buyerId', select: '_id name email' },
        { path: 'orderItems.productId', select: '_id title imageUrl price' },
      ])
      .sort({ createdAt: -1 });

    console.log('Found orders for seller:', orders.length);

    // Transform orders to show only seller's items and calculate their portion
    const transformedOrders = orders.map(order => {
      console.log('\n--- Order:', order.orderNumber);
      console.log('Total items:', order.orderItems.length);
      
      // Log each item's sellerId for debugging
      order.orderItems.forEach((item, idx) => {
        console.log(`  Item ${idx}: sellerId=${item.sellerId}, type=${typeof item.sellerId}`);
      });
      
      // Filter only this seller's items - convert both to strings for comparison
      const sellerItems = order.orderItems.filter(item => {
        const itemSellerId = item.sellerId.toString();
        const currentSellerId = req.user.id.toString();
        const matches = itemSellerId === currentSellerId;
        console.log(`  Comparing: ${itemSellerId} === ${currentSellerId} = ${matches}`);
        return matches;
      });

      console.log('Seller items after filter:', sellerItems.length);

      // Calculate seller's sub-order total
      const sellerSubTotal = sellerItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );

      console.log('Seller sub-total:', sellerSubTotal);

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        buyerId: order.buyerId,
        orderItems: sellerItems, // Only seller's items
        totalAmount: sellerSubTotal, // Only seller's portion
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    console.log('\n=== RESPONSE ===');
    console.log('Transformed orders:', transformedOrders.length);
    res.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Error in getSellerOrders:', error);
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 * GET /orders/admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate([
        { path: 'buyerId', select: '_id name email' },
        { path: 'orderItems.productId', select: '_id title imageUrl price' },
        { path: 'orderItems.sellerId', select: '_id name' },
      ])
      .sort({ createdAt: -1 });

    // Transform orders to match frontend expectations
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      userId: order.buyerId, // Map buyerId to userId for frontend
      items: order.orderItems, // Map orderItems to items
      totalAmount: order.totalAmount,
      status: order.status.toLowerCase(), // Convert to lowercase
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.json({ orders: transformedOrders });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * PUT /orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // First, find the order to check permissions
    const order = await Order.findById(req.params.id)
      .populate('orderItems.sellerId', '_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If user is a seller (not admin), check if they have items in this order
    if (req.user.role === 'SELLER') {
      const hasSellerItems = order.orderItems.some(
        item => item.sellerId._id.toString() === req.user.id.toString()
      );
      
      if (!hasSellerItems) {
        return res.status(403).json({ error: 'You do not have permission to update this order' });
      }
    }

    // Update the order status
    order.status = status.toUpperCase();
    
    // If status is DELIVERED, add pending reviews
    if (status.toLowerCase() === 'delivered') {
      const pendingReviews = order.orderItems.map(item => ({
        productId: item.productId,
        reviewSubmitted: false
      }));
      order.pendingReviews = pendingReviews;
    }
    
    await order.save();

    // Populate for response
    await order.populate([
      { path: 'buyerId', select: '_id name email' },
      { path: 'orderItems.productId', select: '_id title imageUrl price' },
    ]);

    // Transform for frontend
    const transformedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      userId: order.buyerId,
      items: order.orderItems,
      totalAmount: order.totalAmount,
      status: order.status.toLowerCase(),
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.json({ 
      success: true,
      message: 'Order status updated successfully',
      order: transformedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order details (Admin only)
 * GET /orders/admin/:id
 */
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'buyerId', select: '_id name email' },
        { path: 'orderItems.productId', select: '_id title imageUrl price' },
        { path: 'orderItems.sellerId', select: '_id name email phone bankAccount' },
      ]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get or create payout records for this order
    const SellerPayout = (await import('../models/SellerPayout.js')).default;
    
    // Group items by seller
    const sellerGroups = {};
    order.orderItems.forEach(item => {
      const sellerId = item.sellerId._id.toString();
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = {
          seller: item.sellerId,
          items: [],
          subtotal: 0,
        };
      }
      const itemTotal = item.price * item.quantity;
      sellerGroups[sellerId].items.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });
      sellerGroups[sellerId].subtotal += itemTotal;
    });

    // Calculate platform commission (15%)
    const platformCommissionRate = 0.15;
    const sellerBreakdown = await Promise.all(
      Object.values(sellerGroups).map(async (group) => {
        const sellerPayout = Math.round(group.subtotal * (1 - platformCommissionRate));
        
        // Find or create payout record
        let payoutRecord = await SellerPayout.findOne({
          orderId: order._id,
          sellerId: group.seller._id,
        });

        if (!payoutRecord) {
          payoutRecord = await SellerPayout.create({
            orderId: order._id,
            sellerId: group.seller._id,
            amount: sellerPayout,
            status: 'pending',
          });
        }

        return {
          seller: {
            _id: group.seller._id,
            name: group.seller.name,
            email: group.seller.email,
            phone: group.seller.phone || 'Not provided',
            bankAccount: group.seller.bankAccount || {
              accountNumber: 'Not provided',
              ifscCode: 'Not provided',
              accountHolderName: 'Not provided',
              bankName: 'Not provided',
            },
          },
          items: group.items,
          subtotal: group.subtotal,
          platformFee: Math.round(group.subtotal * platformCommissionRate),
          sellerPayout,
          payoutStatus: payoutRecord.status,
          payoutId: payoutRecord._id,
        };
      })
    );

    const totalCommission = sellerBreakdown.reduce((sum, s) => sum + s.platformFee, 0);

    res.json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        status: order.status.toLowerCase(),
        paymentStatus: order.paymentStatus,
        paymentId: order.paymentId,
        trackingNumber: order.trackingNumber,
        buyer: order.buyerId,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        platformCommission: totalCommission,
        sellerBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Add tracking number to order (Admin only)
 * PUT /orders/:id/tracking
 */
export const addTrackingNumber = async (req, res, next) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber || !trackingNumber.trim()) {
      return res.status(400).json({ error: 'Tracking number is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingNumber: trackingNumber.trim() },
      { new: true }
    ).populate([
      { path: 'buyerId', select: 'name email' },
      { path: 'orderItems.productId', select: 'title imageUrl price' },
    ]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      success: true,
      message: 'Tracking number added successfully',
      order 
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Update seller payout status (Admin only)
 * PUT /orders/payout/:payoutId/status
 */
export const updatePayoutStatus = async (req, res, next) => {
  try {
    const { payoutId } = req.params;
    const { status, transactionId, notes } = req.body;

    if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const SellerPayout = (await import('../models/SellerPayout.js')).default;
    
    const payout = await SellerPayout.findById(payoutId);
    
    if (!payout) {
      return res.status(404).json({ error: 'Payout record not found' });
    }

    payout.status = status;
    if (transactionId) payout.transactionId = transactionId;
    if (notes) payout.notes = notes;
    if (status === 'completed') {
      payout.paidAt = new Date();
      payout.paidBy = req.user.id;
    }

    await payout.save();

    res.json({
      success: true,
      message: 'Payout status updated successfully',
      payout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get seller-specific order details
 * GET /orders/seller/:id
 */
export const getSellerOrderDetails = async (req, res, next) => {
  try {
    console.log('=== GET SELLER ORDER DETAILS ===');
    console.log('Order ID:', req.params.id);
    console.log('Seller ID from req.user:', req.user.id, 'Type:', typeof req.user.id);
    
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'buyerId', select: '_id name email' },
        { path: 'orderItems.productId', select: '_id title imageUrl price' },
        { path: 'orderItems.sellerId', select: '_id name' },
      ]);

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Order found:', order.orderNumber);
    console.log('Total items in order:', order.orderItems.length);

    // Filter order items to only show seller's products - convert both to strings
    const sellerItems = order.orderItems.filter(item => {
      const itemSellerId = item.sellerId._id.toString();
      const currentSellerId = req.user.id.toString();
      const matches = itemSellerId === currentSellerId;
      console.log(`Item sellerId: ${itemSellerId}, Current seller: ${currentSellerId}, Matches: ${matches}`);
      return matches;
    });

    console.log('Seller items after filter:', sellerItems.length);

    if (sellerItems.length === 0) {
      console.log('No items found for this seller - returning 403');
      return res.status(403).json({ error: 'You do not have access to this order' });
    }

    // Calculate seller's portion
    const subOrderValue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const platformFee = Math.round(subOrderValue * 0.15);
    const sellerPayout = subOrderValue - platformFee;

    console.log('Sub-order value:', subOrderValue);
    console.log('Platform fee:', platformFee);
    console.log('Seller payout:', sellerPayout);

    // Get payout status
    const SellerPayout = (await import('../models/SellerPayout.js')).default;
    let payoutRecord = await SellerPayout.findOne({
      orderId: order._id,
      sellerId: req.user.id,
    });

    if (!payoutRecord) {
      payoutRecord = await SellerPayout.create({
        orderId: order._id,
        sellerId: req.user.id,
        amount: sellerPayout,
        status: 'pending',
      });
    }

    res.json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        buyer: order.buyerId,
        shippingAddress: order.shippingAddress,
        items: sellerItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subOrderValue,
        platformFee,
        sellerPayout,
        payoutStatus: payoutRecord.status,
      },
    });
  } catch (error) {
    console.error('Error in getSellerOrderDetails:', error);
    next(error);
  }
};
