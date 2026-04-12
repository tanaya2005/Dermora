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

// Sample review templates with variety
const reviewTemplates = [
  {
    rating: 5,
    title: "Absolutely Amazing Product!",
    comment: "This product exceeded all my expectations! My skin feels incredibly soft and hydrated. I've been using it for 2 months and the results are remarkable. The texture is perfect and it absorbs quickly without leaving any greasy residue. Highly recommend to anyone looking for quality skincare!",
    sentiment: 'positive'
  },
  {
    rating: 5,
    title: "Best Purchase Ever",
    comment: "I'm so glad I found this product! It has completely transformed my skincare routine. My skin looks healthier, feels smoother, and I've received so many compliments. The ingredients are top-notch and you can really tell the difference in quality. Worth every penny!",
    sentiment: 'positive'
  },
  {
    rating: 4,
    title: "Great Product, Highly Satisfied",
    comment: "Really impressed with this product. The quality is excellent and it does exactly what it promises. My skin has improved significantly since I started using it. The only minor downside is the price point, but considering the results, it's definitely worth the investment.",
    sentiment: 'positive'
  },
  {
    rating: 5,
    title: "Perfect for Sensitive Skin",
    comment: "As someone with very sensitive skin, I'm always cautious about trying new products. This one has been a game-changer! No irritation, no redness, just beautiful, healthy-looking skin. The formula is gentle yet effective. I've already recommended it to all my friends with sensitive skin.",
    sentiment: 'positive'
  },
  {
    rating: 4,
    title: "Excellent Quality Product",
    comment: "Very happy with this purchase. The product arrived well-packaged and the quality is outstanding. I've noticed visible improvements in my skin texture and overall appearance. It takes a few weeks to see full results, but patience pays off. Would definitely buy again!",
    sentiment: 'positive'
  },
  {
    rating: 5,
    title: "Life-Changing Skincare",
    comment: "I've tried countless products over the years, but this one stands out. My dermatologist recommended it and I'm so grateful. My skin has never looked better - it's clearer, brighter, and more radiant. The consistency is perfect and a little goes a long way. Absolutely love it!",
    sentiment: 'positive'
  },
  {
    rating: 4,
    title: "Really Good Product",
    comment: "This product delivers on its promises. I've been using it consistently for about a month and can see noticeable improvements. The texture is luxurious and it feels great on the skin. My only wish is that it came in a larger size because I'm going through it quickly!",
    sentiment: 'positive'
  },
  {
    rating: 5,
    title: "Outstanding Results",
    comment: "Wow! Just wow! This product has exceeded all my expectations. My skin feels amazing - so soft, smooth, and hydrated. I've struggled with dry skin for years and this is the first product that has truly made a difference. The ingredients are clean and effective. Can't recommend enough!",
    sentiment: 'positive'
  },
  {
    rating: 4,
    title: "Very Pleased with Results",
    comment: "Great addition to my skincare routine. The product is well-formulated and you can tell it's made with quality ingredients. I've noticed my skin looks more even-toned and feels healthier. It's become a staple in my daily routine and I plan to continue using it.",
    sentiment: 'positive'
  },
  {
    rating: 5,
    title: "Fantastic Product!",
    comment: "This is hands down one of the best skincare products I've ever used. The results speak for themselves - my skin is glowing and feels incredible. It's gentle enough for daily use but powerful enough to see real results. The packaging is also beautiful and practical. Love everything about it!",
    sentiment: 'positive'
  },
  {
    rating: 3,
    title: "Decent Product",
    comment: "It's a decent product that does what it claims. I've been using it for a few weeks and have seen some improvements, though nothing dramatic. The texture is nice and it doesn't irritate my skin. For the price, I expected slightly better results, but it's still a solid choice.",
    sentiment: 'neutral'
  },
  {
    rating: 4,
    title: "Good Value for Money",
    comment: "Overall, I'm satisfied with this purchase. The product works well and I've noticed positive changes in my skin. It's not a miracle worker, but it's a reliable, quality product that delivers consistent results. The customer service was also excellent when I had questions.",
    sentiment: 'positive'
  }
];

// Sample photo URLs (using placeholder images)
const samplePhotos = [
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
  'https://images.unsplash.com/photo-1556228852-80c3c6d5e5d3?w=400',
  'https://images.unsplash.com/photo-1556228852-b5d4c0c5e5d3?w=400',
];

const getRandomPhotos = () => {
  const numPhotos = Math.floor(Math.random() * 3) + 1; // 1-3 photos
  const shuffled = [...samplePhotos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPhotos);
};

const seedAllProductReviews = async () => {
  try {
    await connectDB();

    console.log('🔍 Fetching all products...');
    const products = await Product.find();
    
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }

    console.log(`📦 Found ${products.length} products`);

    console.log('🔍 Fetching users...');
    const users = await User.find({ role: 'BUYER' });
    
    if (users.length === 0) {
      console.log('❌ No buyer users found. Creating sample users...');
      // Create some sample buyer users
      const sampleUsers = [];
      for (let i = 1; i <= 10; i++) {
        const user = new User({
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          password: 'hashedpassword123', // In production, this should be properly hashed
          role: 'BUYER'
        });
        await user.save();
        sampleUsers.push(user);
      }
      users.push(...sampleUsers);
      console.log(`✅ Created ${sampleUsers.length} sample users`);
    }

    console.log(`👥 Found ${users.length} users`);

    // Clear existing reviews (optional - comment out if you want to keep existing reviews)
    console.log('🗑️ Clearing existing reviews...');
    await Review.deleteMany({});
    console.log('✅ Cleared existing reviews');

    let totalReviewsCreated = 0;
    let totalOrdersCreated = 0;

    // Create reviews for each product
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 5) + 3; // 3-7 reviews per product
      console.log(`\n📝 Creating ${numReviews} reviews for: ${product.title}`);

      for (let i = 0; i < numReviews; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const reviewTemplate = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

        // Create an order for this review (required by the schema)
        const order = new Order({
          buyerId: user._id,
          orderItems: [{
            productId: product._id,
            sellerId: product.sellerId,
            quantity: 1,
            price: product.price
          }],
          totalAmount: product.price,
          status: 'DELIVERED',
          paymentStatus: 'completed',
          shippingAddress: {
            street: '123 Sample Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pendingReviews: [{
            productId: product._id,
            reviewSubmitted: true
          }]
        });

        await order.save();
        totalOrdersCreated++;

        // Create the review
        try {
          const review = new Review({
            userId: user._id,
            productId: product._id,
            orderId: order._id,
            sellerId: product.sellerId,
            rating: reviewTemplate.rating,
            title: reviewTemplate.title,
            comment: reviewTemplate.comment,
            photos: getRandomPhotos(),
            sentiment: reviewTemplate.sentiment,
            moderationStatus: 'approved',
            isVisible: true,
            isVerifiedPurchase: true,
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Random date within last 60 days
          });

          await review.save();
          totalReviewsCreated++;
        } catch (error) {
          // Skip if duplicate review (same user, product, order combination)
          if (error.code !== 11000) {
            console.error(`  ⚠️ Error creating review: ${error.message}`);
          }
        }
      }
    }

    console.log(`\n✅ Created ${totalReviewsCreated} reviews across ${products.length} products`);
    console.log(`✅ Created ${totalOrdersCreated} sample orders`);

    // Update product ratings and review counts
    console.log('\n📊 Updating product ratings...');
    for (const product of products) {
      const productReviews = await Review.find({ 
        productId: product._id,
        isVisible: true,
        moderationStatus: 'approved'
      });

      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        const totalReviews = productReviews.length;

        await Product.findByIdAndUpdate(product._id, {
          averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          totalReviews: totalReviews
        });

        console.log(`  ✓ ${product.title}: ${avgRating.toFixed(1)} stars (${totalReviews} reviews)`);
      }
    }

    console.log('\n🎉 Review seeding completed successfully!');
    console.log(`\n📈 Summary:`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Reviews: ${totalReviewsCreated}`);
    console.log(`   - Orders: ${totalOrdersCreated}`);
    console.log(`   - Average reviews per product: ${(totalReviewsCreated / products.length).toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAllProductReviews();
