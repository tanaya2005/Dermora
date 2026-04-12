import 'dotenv/config';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkNegativeReviews = async () => {
  try {
    await connectDB();

    const negativeReviews = await Review.find({ 
      rating: { $lte: 2 },
      sellerReply: null 
    }).populate('productId', 'title').populate('userId', 'name');

    console.log(`\n📊 Found ${negativeReviews.length} negative reviews without seller replies:\n`);
    
    negativeReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.rating}★ - ${review.productId?.title || 'Unknown'}`);
      console.log(`   By: ${review.userId?.name || 'Anonymous'}`);
      console.log(`   "${review.comment.substring(0, 80)}..."`);
      console.log('');
    });

    console.log(`\n✅ Total: ${negativeReviews.length} negative reviews need attention!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkNegativeReviews();
