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
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
