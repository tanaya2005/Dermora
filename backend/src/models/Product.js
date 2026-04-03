import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  ageGroup: {
    type: String,
    enum: ['infant', 'child', 'teen', 'adult', 'all-ages'],
    default: 'adult',
  },
  imageUrl: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  searchCount: {
    type: Number,
    default: 0,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  addToCartCount: {
    type: Number,
    default: 0,
  },
  purchaseCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });

export default mongoose.model('Product', productSchema);
