import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  redirectUrl: {
    type: String,
    required: true
  },
  targetAudience: {
    type: String,
    enum: ['all', 'signed_in', 'guest'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  impressionCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
advertisementSchema.index({ isActive: 1, startDate: 1, endDate: 1, priority: -1 });

export default mongoose.model('Advertisement', advertisementSchema);