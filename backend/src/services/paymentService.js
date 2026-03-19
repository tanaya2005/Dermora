import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance only if keys are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️  Razorpay keys not found. Payment functionality will be disabled.');
}

/**
 * Create Razorpay order
 * @param {number} amount - Amount in rupees (will be converted to paise)
 * @param {string} orderId - Internal order ID for reference
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrder = async (amount, orderId) => {
  if (!razorpay) {
    throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
  }

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: orderId,
    notes: {
      order_id: orderId,
    },
  };

  return await razorpay.orders.create(options);
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret not configured. Please set RAZORPAY_KEY_SECRET in environment variables.');
  }

  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
};
