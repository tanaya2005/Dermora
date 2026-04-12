import 'dotenv/config';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleReviews = [
  {
    rating: 5,
    comment: "This moisturizer is absolutely amazing! My skin feels so soft and hydrated. I've been using it for 2 months and the results are incredible. Highly recommend!",
    sentiment: 'positive'
  },
  {
    rating: 4,
    comment: "Great product overall. The texture is nice and it absorbs well. Only downside is the price, but the quality makes up for it.",
    sentiment: 'positive'
  },
  {
    rating: 5,
    comment: "Perfect for sensitive skin! No irritation at all and my skin looks healthier than ever. Will definitely repurchase.",
    sentiment: 'positive'
  },
  {
    rating: 3,
    comment: "It's okay, nothing special. Does the job but I've used better products for the same price range.",
    sentiment: 'neutral'
  },
  {
    rating: 4,
    comment: "Good moisturizer, my dermatologist recommended it. Takes a while to see results but worth the wait.",
    sentiment: 'positive'
  },
  {
    rating: 2,
    comment: "Didn't work for my skin type. Caused some breakouts unfortunately. Might work for others though.",
    sentiment: 'negative'
  },
  {
    rating: 5,
    comment: "Love this! Been using for 6 months and my skin texture has improved dramatically. Great for anti-aging.",
    sentiment: 'positive'
  },
  {
    rating: 4,
    comment: "Nice product, good ingredients. The packaging could be better but the formula is excellent.",
    sentiment: 'positive'
  }
];

const seedReviews = async () => {
  try {
    await connectDB();

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️ Cleared existing reviews');

    // Get some products and users
    const products = await Product.find().limit(5);
    const users = await User.find().limit(10);

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      return;
    }

    // Create sample orders first (required for reviews)
    const orders = [];
    for (let i = 0; i < 8; i++) {
      const user = users[i % users.length];
      const product = products[i % products.length];
      
      const order = new Order({
        userId: user._id,
        items: [{
          productId: product._id,
          sellerId: product.sellerId,
          quantity: 1,
          price: product.price
        }],
        totalAmount: product.price,
        status: 'delivered',
        shippingAddress: {
          fullName: user.name,
          phone: '1234567890',
          addressLine1: '123 Main St',
          city: 'Sample City',
          state: 'Sample State',
          pincode: '123456',
          country: 'India'
        }
      });
      
      await order.save();
      orders.push(order);
    }

    // Create reviews
    const reviews = [];
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i];
      const user = users[i % users.length];
      const product = products[i % products.length];
      const order = orders[i % orders.length];

      const review = new Review({
        userId: user._id,
        productId: product._id,
        orderId: order._id,
        sellerId: product.sellerId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        sentiment: reviewData.sentiment,
        moderationStatus: 'approved',
        isVisible: true,
        isVerifiedPurchase: true
      });

      await review.save();
      reviews.push(review);
    }

    console.log(`✅ Created ${reviews.length} sample reviews`);
    console.log(`✅ Created ${orders.length} sample orders`);
    
    // Update product ratings
    for (const product of products) {
      const productReviews = reviews.filter(r => r.productId.toString() === product._id.toString());
      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        await Product.findByIdAndUpdate(product._id, {
          averageRating: avgRating,
          reviewCount: productReviews.length
        });
      }
    }

    console.log('✅ Updated product ratings');
    console.log('🎉 Review seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedReviews();