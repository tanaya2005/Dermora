import mongoose from 'mongoose';

const listingFeeSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalProductValue: {
    type: Number,
    required: true,
  },
  feePercentage: {
    type: Number,
    default: 20, // 20% listing fee
  },
  feeAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date,
}, {
  timestamps: true,
});

listingFeeSchema.index({ sellerId: 1 });
listingFeeSchema.index({ productId: 1 });

export default mongoose.model('ListingFee', listingFeeSchema);
