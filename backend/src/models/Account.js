import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  accessToken: String,
  refreshToken: String,
  idToken: String,
  expiresAt: Date,
  password: String,
}, {
  timestamps: true,
});

export default mongoose.model('Account', accountSchema);
