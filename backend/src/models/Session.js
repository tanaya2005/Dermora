import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

export default mongoose.model('Session', sessionSchema);
