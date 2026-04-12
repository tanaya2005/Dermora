import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { classifySentiment } from '../utils/sentiment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dermora';

// Sample review data with photos
const reviewsData = [
  {
    rating: 5,
    comment: "Absolutely love this product! My skin has never looked better. The texture is amazing and it absorbs quickly without leaving any greasy residue. I've been using it for 3 weeks now and can already see visible results. My skin feels smoother, looks more radiant, and the fine lines around my eyes have reduced significantly. Highly recommend this to anyone looking for effective skincare!",
    photos: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    ]
  },
  {
    rating: 4,
    comment: "Great product overall! I've been using this serum for about a month now and I'm quite happy with the results. My skin texture has improved and it feels more hydrated. The only reason I'm not giving 5 stars is because it took a bit longer than expected to see results. But once the results started showing, they were impressive. The packaging is also very elegant and the pump dispenser makes it easy to use.",
    photos: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'
    ]
  },
  {
    rating: 5,
    comment: "This is hands down the best skincare product I've ever used! My dermatologist recommended it and I'm so glad I listened. Within two weeks, my acne scars started fading and my skin tone became more even. The formula is gentle yet effective, perfect for my sensitive skin. I've already recommended this to all my friends and family. Worth every penny!",
    photos: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400'
    ]
  },
  {
    rating: 3,
    comment: "It's an okay product. Does what it claims but nothing extraordinary. I've been using it for about 2 weeks and haven't seen dramatic changes yet. My skin feels slightly more moisturized but I was expecting more visible results based on the reviews. Maybe I need to use it longer to see better results. The texture is nice and it doesn't irritate my skin, which is a plus.",
    photos: [
      'https://images.unsplash.com/photo-1556228852-80c3b8de4a97?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    ]
  },
  {
    rating: 5,
    comment: "Fantastic results! I was skeptical at first but this product exceeded all my expectations. My skin looks healthier, feels softer, and the glow is real! I've tried many expensive brands before but this one actually delivers on its promises. The best part is that it's suitable for daily use and doesn't cause any breakouts. I'm definitely repurchasing this!",
    photos: [
      'https://images.unsplash.com/photo-1556228578-dd6a8b0e3b7c?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      'https://images.unsplash.com/photo-1556228852-80c3b8de4a97?w=400'
    ]
  },
  {
    rating: 4,
    comment: "Very good product with noticeable improvements in skin texture and hydration. I've been using this for about 6 weeks now and my skin definitely looks better. The fine lines have reduced and my skin feels plumper. The only minor issue is the price point, but considering the quality and results, it's worth the investment. Would definitely recommend to friends!",
    photos: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'
    ]
  },
  {
    rating: 5,
    comment: "Best purchase ever! This product has transformed my skincare routine completely. My skin has never been this clear and radiant. I love how lightweight the formula is and how quickly it absorbs. No sticky feeling at all. After using this for a month, even my makeup applies better. The compliments I've been getting are proof that this works! Buying again for sure!",
    photos: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      'https://images.unsplash.com/photo-1556228852-80c3b8de4a97?w=400'
    ]
  },
  {
    rating: 2,
    comment: "Unfortunately, this didn't work for my skin type. I have sensitive skin and this product caused some irritation and redness. I used it for a week hoping my skin would adjust but the irritation persisted. The texture and smell are nice, but it just wasn't suitable for me. If you have sensitive skin, maybe do a patch test first before applying it all over your face.",
    photos: [
      'https://images.unsplash.com/photo-1556228578-dd6a8b0e3b7c?w=400'
    ]
  },
  {
    rating: 4,
    comment: "Solid product that delivers good results. I've been using this consistently for about 5 weeks and have noticed improvements in my skin's overall appearance. My pores look smaller and my skin feels more balanced. It's not a miracle worker but it's definitely effective. The packaging is premium and the product lasts a long time. Good value for money overall.",
    photos: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    ]
  },
  {
    rating: 5,
    comment: "Amazing product! I'm so impressed with the quality and effectiveness. My skin looks younger and feels incredibly soft. The dark spots I had are fading and my complexion is more even. I've tried so many products over the years but this one actually works. The customer service was also excellent when I had questions. Highly recommend to everyone!",
    photos: [
      'https://images.unsplash.com/photo-1556228852-80c3b8de4a97?w=400',
      'https://images.unsplash.com/photo-1556228578-dd6a8b0e3b7c?w=400',
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400'
    ]
  }
];

async function seedReviews() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find().limit(10);
    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      process.exit(1);
    }

    // Get all buyers
    const buyers = await User.find({ role: 'BUYER' }).limit(5);
    if (buyers.length === 0) {
      console.log('No buyers found. Creating sample buyers...');
      // Create sample buyers if none exist
      const sampleBuyers = await User.create([
        {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456', // hashed password
          role: 'BUYER'
        },
        {
          name: 'Rahul Kumar',
          email: 'rahul@example.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
          role: 'BUYER'
        },
        {
          name: 'Ananya Patel',
          email: 'ananya@example.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
          role: 'BUYER'
        }
      ]);
      buyers.push(...sampleBuyers);
    }

    // Delete existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    const reviews = [];
    let reviewCount = 0;
    const usedCombinations = new Set();

    // Create reviews for each product
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 5) + 3; // 3-7 reviews per product
      
      for (let i = 0; i < numReviews && reviewCount < reviewsData.length * products.length; i++) {
        // Find a unique buyer for this product
        let buyer;
        let attempts = 0;
        do {
          buyer = buyers[Math.floor(Math.random() * buyers.length)];
          const combination = `${buyer._id}-${product._id}`;
          
          if (!usedCombinations.has(combination)) {
            usedCombinations.add(combination);
            break;
          }
          attempts++;
        } while (attempts < buyers.length);

        if (attempts >= buyers.length) {
          continue; // Skip if no unique buyer found
        }

        const reviewData = reviewsData[i % reviewsData.length];

        // Create or find an order for this buyer and product
        let order = await Order.findOne({
          buyerId: buyer._id,
          'orderItems.productId': product._id,
          status: 'DELIVERED'
        });

        if (!order) {
          // Create a sample order
          order = await Order.create({
            buyerId: buyer._id,
            orderItems: [{
              productId: product._id,
              sellerId: product.sellerId,
              quantity: 1,
              price: product.price
            }],
            totalAmount: product.price,
            status: 'DELIVERED',
            paymentStatus: 'completed'
          });
        }

        // Analyze sentiment
        const sentimentResult = classifySentiment(reviewData.comment);

        // Create review
        const review = {
          userId: buyer._id,
          productId: product._id,
          orderId: order._id,
          sellerId: product.sellerId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          photos: reviewData.photos,
          sentiment: sentimentResult.sentiment,
          sentimentKeywordsMatched: sentimentResult.matched,
          isVerifiedPurchase: true,
          moderationStatus: 'approved',
          isVisible: true,
          helpfulCount: Math.floor(Math.random() * 20),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        };

        reviews.push(review);
        reviewCount++;
      }
    }

    // Insert all reviews
    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviewCount} reviews`);

    // Update product ratings
    console.log('Updating product ratings...');
    for (const product of products) {
      const productReviews = await Review.find({ productId: product._id, isVisible: true });
      
      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        const negativeCount = productReviews.filter(r => r.rating <= 2).length;
        const negativePercentage = (negativeCount / productReviews.length) * 100;

        await Product.findByIdAndUpdate(product._id, {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: productReviews.length,
          negativePercentage: Math.round(negativePercentage)
        });
      }
    }
    console.log('✅ Updated product ratings');

    console.log('\n🎉 Review seeding completed successfully!');
    console.log(`Total reviews created: ${reviewCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
