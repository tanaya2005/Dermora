import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// Plan definitions (amounts in paise for Razorpay)
export const PLANS = {
  individual: {
    name: 'Individual Plan',
    priceMonthly: 1499,   // ₹1,499/month
    priceInPaise: 149900,
    products: 3,
    description: '3 personalised products every month',
  },
  couple: {
    name: 'Couple Plan',
    priceMonthly: 2299,   // ₹2,299/month
    priceInPaise: 229900,
    products: 5,
    description: '5 products for two skin types monthly',
  },
  family: {
    name: 'Family Plan',
    priceMonthly: 3699,   // ₹3,699/month
    priceInPaise: 369900,
    products: 8,
    description: '8 products for the whole family monthly',
  },
};

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay not configured.');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * POST /api/subscription/create-order
 * Creates a Razorpay order for a subscription plan
 */
export const createSubscriptionOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Choose: individual, couple, family' });
    }

    const razorpay = getRazorpay();
    const planDetails = PLANS[plan];

    const order = await razorpay.orders.create({
      amount: planDetails.priceInPaise,
      currency: 'INR',
      receipt: `sub_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        plan,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      keyId: process.env.RAZORPAY_KEY_ID,
      planDetails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscription/verify
 * Verifies Razorpay payment and activates subscription
 */
export const verifySubscription = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Activate subscription for 30 days
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(req.user.id, {
      subscription: {
        plan,
        isActive: true,
        startDate,
        endDate,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    });

    res.json({
      message: 'Subscription activated successfully!',
      plan,
      startDate,
      endDate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subscription/my-plan
 * Returns the current user's subscription details
 */
export const getMyPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('subscription name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sub = user.subscription;

    // Auto-expire if past endDate
    if (sub?.isActive && sub.endDate && new Date() > sub.endDate) {
      await User.findByIdAndUpdate(req.user.id, { 'subscription.isActive': false });
      sub.isActive = false;
    }

    res.json({
      subscription: sub || { plan: 'none', isActive: false },
      planDetails: sub?.plan && sub.plan !== 'none' ? PLANS[sub.plan] : null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscription/cancel
 * Cancels the user's active subscription
 */
export const cancelSubscription = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      'subscription.isActive': false,
    });

    res.json({ message: 'Subscription cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};
