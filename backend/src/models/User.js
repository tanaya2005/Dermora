import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  image: String,
  role: {
    type: String,
    enum: ['ADMIN', 'SELLER', 'BUYER'],
    default: 'BUYER',
  },
  profileImage: String,
  // Skin Assessment Data
  skinProfile: {
    skinType: {
      type: String,
      enum: ['dry', 'oily', 'combination', 'sensitive'],
    },
    skinConcerns: [{
      type: String,
      enum: ['acne', 'aging', 'pigmentation', 'texture', 'redness'],
    }],
    budget: {
      type: String,
      enum: ['under-1000', '1000-3000', '3000-5000', 'above-5000'],
    },
    preferredCategories: [{
      type: String,
      enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment', 'mask'],
    }],
    assessmentCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  // Subscription Data
  subscription: {
    plan: {
      type: String,
      enum: ['none', 'individual', 'couple', 'family'],
      default: 'none',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
    razorpayPaymentId: String,
    razorpayOrderId: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
