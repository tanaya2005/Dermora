import ListingFee from '../models/ListingFee.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';

const LISTING_FEE_PERCENTAGE = 20; // 20% listing fee

/**
 * Calculate listing fee for products
 * POST /api/listing-fee/calculate
 */
export const calculateListingFee = async (req, res, next) => {
  try {
    const { productPrice, quantity = 1 } = req.body;

    if (!productPrice || productPrice <= 0) {
      return res.status(400).json({ error: 'Valid product price is required' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const totalProductValue = productPrice * quantity;
    const feeAmount = Math.round((totalProductValue * LISTING_FEE_PERCENTAGE) / 100);

    res.json({
      productPrice,
      quantity,
      totalProductValue,
      feePercentage: LISTING_FEE_PERCENTAGE,
      feeAmount,
      totalAmount: feeAmount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create listing fee payment order
 * POST /api/listing-fee/create-order
 */
export const createListingFeeOrder = async (req, res, next) => {
  try {
    const { productPrice, quantity = 1 } = req.body;

    if (!productPrice || productPrice <= 0) {
      return res.status(400).json({ error: 'Valid product price is required' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const totalProductValue = productPrice * quantity;
    const feeAmount = Math.round((totalProductValue * LISTING_FEE_PERCENTAGE) / 100);

    // Create listing fee record
    const listingFee = await ListingFee.create({
      sellerId: req.user.id,
      productPrice,
      quantity,
      totalProductValue,
      feePercentage: LISTING_FEE_PERCENTAGE,
      feeAmount,
      status: 'pending',
    });

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      feeAmount,
      `listing_${listingFee._id}`
    );

    // Update listing fee with Razorpay order ID
    listingFee.razorpayOrderId = razorpayOrder.id;
    await listingFee.save();

    res.json({
      listingFeeId: listingFee._id,
      razorpayOrderId: razorpayOrder.id,
      amount: feeAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify listing fee payment
 * POST /api/listing-fee/verify
 */
export const verifyListingFeePayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      listingFeeId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !listingFeeId) {
      return res.status(400).json({ error: 'Missing payment verification data' });
    }

    // Find listing fee record
    const listingFee = await ListingFee.findById(listingFeeId);

    if (!listingFee) {
      return res.status(404).json({ error: 'Listing fee record not found' });
    }

    if (listingFee.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      listingFee.status = 'failed';
      await listingFee.save();
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update listing fee record
    listingFee.status = 'paid';
    listingFee.razorpayPaymentId = razorpay_payment_id;
    listingFee.razorpaySignature = razorpay_signature;
    listingFee.paidAt = new Date();
    await listingFee.save();

    res.json({
      success: true,
      message: 'Listing fee payment verified successfully',
      listingFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get seller's listing fee history
 * GET /api/listing-fee/history
 */
export const getListingFeeHistory = async (req, res, next) => {
  try {
    const listingFees = await ListingFee.find({ sellerId: req.user.id })
      .populate('productId', 'title imageUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ listingFees });
  } catch (error) {
    next(error);
  }
};
