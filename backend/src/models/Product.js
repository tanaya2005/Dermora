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
  imageUrl: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });

export default mongoose.model('Product', productSchema);
