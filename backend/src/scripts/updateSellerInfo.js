import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateSellerInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update seller@gmail.com
    const seller1 = await User.findOneAndUpdate(
      { email: 'seller@gmail.com' },
      {
        phone: '+91 98765 43210',
        bankAccount: {
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'Tanaya Sharma',
          bankName: 'HDFC Bank',
        },
      },
      { new: true }
    );

    if (seller1) {
      console.log('✅ Updated seller@gmail.com with contact and bank details');
    }

    // Update seller1@gmail.com
    const seller2 = await User.findOneAndUpdate(
      { email: 'seller1@gmail.com' },
      {
        phone: '+91 87654 32109',
        bankAccount: {
          accountNumber: '9876543210',
          ifscCode: 'ICIC0005678',
          accountHolderName: 'Atharva Patel',
          bankName: 'ICICI Bank',
        },
      },
      { new: true }
    );

    if (seller2) {
      console.log('✅ Updated seller1@gmail.com with contact and bank details');
    }

    console.log('\n✨ Seller information updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateSellerInfo();
