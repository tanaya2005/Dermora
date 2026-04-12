import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get seller@gmail.com specifically
    const mainSeller = await User.findOne({ email: 'seller@gmail.com' });
    
    if (!mainSeller) {
      console.log('❌ seller@gmail.com not found!');
      process.exit(1);
    }

    console.log(`✅ Found seller: ${mainSeller.name} (${mainSeller.email})`);

    // Get products from this seller
    const sellerProducts = await Product.find({ sellerId: mainSeller._id }).limit(10);
    
    if (sellerProducts.length === 0) {
      console.log('❌ No products found for seller@gmail.com!');
      process.exit(1);
    }

    console.log(`✅ Found ${sellerProducts.length} products for this seller`);

    // Get some buyers
    const buyers = await User.find({ role: 'BUYER' }).limit(5);
    
    if (buyers.length === 0) {
      console.log('⚠️  No buyers found. Creating a test buyer...');
      const { hashPassword } = await import('../utils/hash.js');
      const hashedPassword = await hashPassword('buyer123');
      
      const newBuyer = await User.create({
        name: 'Test Buyer',
        email: 'buyer@test.com',
        password: hashedPassword,
        role: 'BUYER',
        emailVerified: true
      });
      buyers.push(newBuyer);
      console.log('✅ Test buyer created');
    }

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const sampleOrders = [];

    // Get current order count for order number generation
    const existingOrderCount = await Order.countDocuments();

    // Create 15 orders with seller@gmail.com's products
    for (let i = 0; i < 15; i++) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const orderItems = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const product = sellerProducts[Math.floor(Math.random() * sellerProducts.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
        const price = product.price * quantity;
        
        orderItems.push({
          productId: product._id,
          sellerId: mainSeller._id, // Use seller@gmail.com's ID
          quantity,
          price: product.price,
        });
        
        totalAmount += price;
      }

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentStatus = status === 'CANCELLED' ? 'failed' : 
                           status === 'PENDING' ? 'pending' : 'completed';

      // Random date in last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const order = {
        buyerId: buyer._id,
        orderNumber: `ORD${String(existingOrderCount + i + 1).padStart(6, '0')}`, // Generate order number
        totalAmount,
        status,
        paymentStatus,
        orderItems,
        shippingAddress: {
          street: `${Math.floor(Math.random() * 999) + 1} MG Road`,
          city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
          state: ['Maharashtra', 'Delhi', 'Karnataka', 'Maharashtra', 'Telangana'][Math.floor(Math.random() * 5)],
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        },
        trackingNumber: status === 'SHIPPED' || status === 'DELIVERED' ? 
          `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}` : undefined,
        createdAt,
        updatedAt: createdAt,
      };

      sampleOrders.push(order);
    }

    // Insert orders
    const insertedOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${insertedOrders.length} orders for seller@gmail.com`);

    // Show summary
    const summary = {
      total: insertedOrders.length,
      pending: insertedOrders.filter(o => o.status === 'PENDING').length,
      processing: insertedOrders.filter(o => o.status === 'PROCESSING').length,
      shipped: insertedOrders.filter(o => o.status === 'SHIPPED').length,
      delivered: insertedOrders.filter(o => o.status === 'DELIVERED').length,
      cancelled: insertedOrders.filter(o => o.status === 'CANCELLED').length,
    };

    console.log('\n📊 Order Summary for seller@gmail.com:');
    console.log(`   Total: ${summary.total}`);
    console.log(`   Pending: ${summary.pending}`);
    console.log(`   Processing: ${summary.processing}`);
    console.log(`   Shipped: ${summary.shipped}`);
    console.log(`   Delivered: ${summary.delivered}`);
    console.log(`   Cancelled: ${summary.cancelled}`);

    console.log('\n✨ Orders seeded successfully for seller@gmail.com!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
