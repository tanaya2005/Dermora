import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';
import { verifyPaymentSchema } from '../validators/index.js';

/**
 * Create Razorpay order
 * POST /payments/create-order
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Fetch order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order already processed' });
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(order.totalAmount, order._id.toString());

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment and update order
 * POST /payments/verify
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);

    // Verify signature
    const isValid = verifyPaymentSignature(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order and reduce stock
    const order = await Order.findById(validatedData.orderId).populate('orderItems.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    order.status = 'PROCESSING';
    order.paymentId = validatedData.razorpay_payment_id;
    await order.save();

    // Reduce stock for each product
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.deleteMany({ userId: order.buyerId });

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    next(error);
  }
};
