import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 120,
  },
  comment: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 2000,
  },
  photos: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 1 && v.length <= 5;
      },
      message: 'At least 1 photo is required (maximum 5)'
    }
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
  sentimentKeywordsMatched: {
    type: [String],
    default: [],
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  helpfulVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  reportedCount: {
    type: Number,
    default: 0,
  },
  // Moderation fields
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'approved', // Auto-approve by default
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  moderatedAt: Date,
  moderationReason: String,
  adminNote: String,
  // Seller reply
  sellerReply: {
    type: String,
    default: null,
  },
  sellerRepliedAt: {
    type: Date,
    default: null,
  },
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now,
    }
  }],
}, {
  timestamps: true,
});

// Indexes for performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });
reviewSchema.index({ sellerId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ sentiment: 1 });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

export default mongoose.model('Review', reviewSchema);