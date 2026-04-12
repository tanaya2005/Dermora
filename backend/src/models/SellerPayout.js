import mongoose from 'mongoose';

const sellerPayoutSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: String,
  transactionId: String,
  notes: String,
  paidAt: Date,
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

sellerPayoutSchema.index({ orderId: 1, sellerId: 1 });
sellerPayoutSchema.index({ sellerId: 1, status: 1 });

export default mongoose.model('SellerPayout', sellerPayoutSchema);
