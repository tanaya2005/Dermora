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

// Negative review templates with 1-2 star ratings
const negativeReviewTemplates = [
  {
    rating: 1,
    title: "Terrible Product - Waste of Money",
    comment: "This product is absolutely terrible! It caused severe breakouts on my skin within just two days of use. The texture is greasy and it doesn't absorb at all. I've used many skincare products before but this is by far the worst. Complete waste of money and I'm very disappointed. Would not recommend to anyone!",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "Not Worth the Price",
    comment: "Very disappointed with this purchase. The product arrived with a broken seal and the consistency was completely off - it was watery and separated. For the price I paid, I expected much better quality. Customer service was unhelpful when I tried to return it. Save your money and buy something else.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Caused Allergic Reaction",
    comment: "WARNING: This product caused a severe allergic reaction on my face. My skin became red, itchy, and started burning immediately after application. I had to see a dermatologist to treat the reaction. The ingredient list doesn't match what's advertised. Very dangerous and poorly made product.",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "Doesn't Work as Advertised",
    comment: "Used this product for over a month as directed and saw absolutely no results. The claims about reducing fine lines and brightening skin are completely false. It's just an overpriced moisturizer that does nothing special. Very misleading marketing and I feel cheated.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Horrible Smell and Texture",
    comment: "This product has the most awful chemical smell that doesn't go away even after application. The texture is sticky and leaves a white cast on my skin. It pills up when I try to apply makeup over it. Absolutely disgusting and unusable. Threw it away after one use.",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "Made My Skin Worse",
    comment: "My skin condition actually got worse after using this product. I started getting more acne and my skin became extremely dry and flaky. The formula is too harsh and stripped all the natural oils from my face. Had to stop using it and go back to my old routine to repair the damage.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Fake Product - Not Authentic",
    comment: "I'm pretty sure this is a counterfeit product. The packaging looks cheap, the batch number doesn't match the official website, and the product itself looks and smells nothing like the original. This is fraud and I'm reporting this seller. Do not buy from here!",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "Expired Product Received",
    comment: "Received a product that was already expired by 3 months! The expiry date was clearly printed but they sent it anyway. When I contacted them, they refused to refund or replace. This is unacceptable and potentially harmful. Check expiry dates before buying from this seller.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Worst Purchase Ever",
    comment: "I regret buying this so much. The product is completely ineffective and actually made my skin problems worse. It clogged my pores and gave me painful cystic acne. The ingredients are cheap and the formulation is terrible. This company should be ashamed of selling such poor quality products.",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "Poor Quality Control",
    comment: "The product arrived half empty and the pump dispenser was broken. The formula had separated and there were weird lumps in it. Clearly no quality control at all. When I tried to use it anyway, it irritated my skin. Very poor manufacturing standards and terrible packaging.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Caused Severe Dryness",
    comment: "This product completely destroyed my skin barrier. After just one week of use, my face became extremely dry, tight, and started peeling. It's way too harsh and the concentration of active ingredients is dangerous. My dermatologist was shocked when I showed her. Stay away from this!",
    sentiment: 'negative'
  },
  {
    rating: 2,
    title: "False Advertising",
    comment: "The product description and actual product are completely different. It claims to be fragrance-free but has a strong artificial perfume smell. Says it's suitable for sensitive skin but contains several known irritants. The before/after photos on the website are clearly photoshopped. Total scam.",
    sentiment: 'negative'
  },
  {
    rating: 1,
    title: "Dangerous Ingredients",
    comment: "After researching the ingredients, I found several harmful chemicals that shouldn't be in skincare products. Some ingredients are banned in other countries due to safety concerns. This product is potentially dangerous and I'm shocked it's being sold. Filing a complaint with consumer protection.",
    sentiment: 'negative'
  }
];

// Sample photo URLs for negative reviews
const negativeReviewPhotos = [
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400',
];

const getRandomPhotos = () => {
  const numPhotos = Math.floor(Math.random() * 2) + 1; // 1-2 photos
  const shuffled = [...negativeReviewPhotos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPhotos);
};

const seedNegativeReviewsForSellers = async () => {
  try {
    await connectDB();

    console.log('🔍 Finding sellers...');
    const seller1 = await User.findOne({ email: 'seller@gmail.com' });
    const seller2 = await User.findOne({ email: 'seller1@gmail.com' });

    if (!seller1 && !seller2) {
      console.log('❌ Neither seller@gmail.com nor seller1@gmail.com found in database.');
      return;
    }

    const sellerIds = [];
    if (seller1) {
      sellerIds.push(seller1._id);
      console.log(`✓ Found seller@gmail.com (${seller1.name})`);
    }
    if (seller2) {
      sellerIds.push(seller2._id);
      console.log(`✓ Found seller1@gmail.com (${seller2.name})`);
    }

    console.log('\n🔍 Fetching products from these sellers...');
    const products = await Product.find({ sellerId: { $in: sellerIds } });
    
    if (products.length === 0) {
      console.log('❌ No products found for these sellers.');
      return;
    }

    console.log(`📦 Found ${products.length} products from these sellers`);

    console.log('\n🔍 Fetching buyer users...');
    let users = await User.find({ role: 'BUYER' });
    
    // Create more users if needed
    const reviewsToCreate = Math.min(13, products.length);
    if (users.length < reviewsToCreate) {
      console.log(`\n👥 Creating ${reviewsToCreate - users.length} additional buyer users...`);
      const newUsers = [];
      for (let i = users.length; i < reviewsToCreate; i++) {
        const newUser = new User({
          name: `Angry Customer ${i + 1}`,
          email: `angry.customer${i + 1}@example.com`,
          password: 'hashedpassword123',
          role: 'BUYER'
        });
        await newUser.save();
        newUsers.push(newUser);
      }
      users = [...users, ...newUsers];
      console.log(`✅ Created ${newUsers.length} new users`);
    }

    console.log(`👥 Using ${users.length} users`);

    let reviewsCreated = 0;
    let ordersCreated = 0;

    // Create negative reviews for products
    for (let i = 0; i < reviewsToCreate; i++) {
      const product = products[i % products.length];
      const user = users[i];
      const reviewTemplate = negativeReviewTemplates[i % negativeReviewTemplates.length];

      console.log(`\n📝 Creating negative review ${i + 1}/${reviewsToCreate} for: ${product.title}`);
      console.log(`   Seller: ${product.sellerId.equals(seller1?._id) ? 'seller@gmail.com' : 'seller1@gmail.com'}`);

      // Create a unique order
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
          street: `${200 + i} Complaint Street`,
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
      ordersCreated++;

      // Create the negative review (without seller reply)
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
          sellerReply: null, // No seller reply - needs attention!
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });

        await review.save();
        reviewsCreated++;
        console.log(`  ✓ Created ${reviewTemplate.rating}★ review: "${reviewTemplate.title}"`);
      } catch (error) {
        if (error.code === 11000) {
          console.error(`  ⚠️ Duplicate review skipped`);
        } else {
          console.error(`  ⚠️ Error: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Created ${reviewsCreated} negative reviews`);
    console.log(`✅ Created ${ordersCreated} sample orders`);

    // Update product ratings
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
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: totalReviews
        });

        console.log(`  ✓ ${product.title}: ${avgRating.toFixed(1)} stars (${totalReviews} reviews)`);
      }
    }

    // Show summary by seller
    console.log('\n📈 Summary by Seller:');
    for (const sellerId of sellerIds) {
      const seller = await User.findById(sellerId);
      const sellerProducts = products.filter(p => p.sellerId.equals(sellerId));
      const negativeReviews = await Review.find({
        sellerId: sellerId,
        rating: { $lte: 2 },
        sellerReply: null
      });

      console.log(`\n  ${seller.email}:`);
      console.log(`    - Products: ${sellerProducts.length}`);
      console.log(`    - Negative reviews needing attention: ${negativeReviews.length}`);
    }

    console.log('\n🎉 Negative review seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding negative reviews:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedNegativeReviewsForSellers();
