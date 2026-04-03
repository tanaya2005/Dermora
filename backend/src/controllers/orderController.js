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
      .populate('orderItems.productId', 'id title imageUrl')
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
    const orders = await Order.find({
      'orderItems.sellerId': req.user.id,
    })
      .populate([
        { path: 'buyerId', select: 'id name email' },
        { path: 'orderItems.productId', select: 'id title imageUrl' },
      ])
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
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
        { path: 'buyerId', select: 'id name email' },
        { path: 'orderItems.productId', select: 'id title' },
        { path: 'orderItems.sellerId', select: 'id name' },
      ])
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * PATCH /orders/admin/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !valid.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate([
      { path: 'buyerId', select: 'name email' },
      { path: 'orderItems.productId', select: 'title imageUrl' },
    ]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};
