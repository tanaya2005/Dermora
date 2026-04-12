import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seedHistoricalOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get both sellers
    const seller1 = await User.findOne({ email: 'seller@gmail.com' });
    const seller2 = await User.findOne({ email: 'seller1@gmail.com' });

    if (!seller1 || !seller2) {
      console.log('❌ One or both sellers not found!');
      process.exit(1);
    }

    console.log(`✅ Found seller@gmail.com: ${seller1.name}`);
    console.log(`✅ Found seller1@gmail.com: ${seller2.name}`);

    // Get products from both sellers
    const seller1Products = await Product.find({ sellerId: seller1._id }).limit(10);
    const seller2Products = await Product.find({ sellerId: seller2._id }).limit(8);

    console.log(`✅ Found ${seller1Products.length} products for seller@gmail.com`);
    console.log(`✅ Found ${seller2Products.length} products for seller1@gmail.com`);

    // Get some buyers
    const buyers = await User.find({ role: 'BUYER' }).limit(5);
    
    if (buyers.length === 0) {
      console.log('❌ No buyers found!');
      process.exit(1);
    }

    console.log(`✅ Found ${buyers.length} buyers`);

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const historicalOrders = [];

    // Get current order count for order number generation
    const existingOrderCount = await Order.countDocuments();

    // Define months to seed (December 2025, January 2026, February 2026, March 2026)
    const months = [
      { month: 11, year: 2025, name: 'December', ordersCount: 8 },  // December (month 11)
      { month: 0, year: 2026, name: 'January', ordersCount: 10 },   // January (month 0)
      { month: 1, year: 2026, name: 'February', ordersCount: 12 },  // February (month 1)
      { month: 2, year: 2026, name: 'March', ordersCount: 15 },     // March (month 2)
    ];

    let orderCounter = existingOrderCount;

    for (const monthData of months) {
      console.log(`\n📅 Creating ${monthData.ordersCount} orders for ${monthData.name} ${monthData.year}...`);

      for (let i = 0; i < monthData.ordersCount; i++) {
        const buyer = buyers[Math.floor(Math.random() * buyers.length)];
        const orderItems = [];
        let totalAmount = 0;

        // Randomly decide if this is a multi-vendor order (60% chance)
        const isMultiVendor = Math.random() > 0.4;

        if (isMultiVendor) {
          // Multi-vendor order: 2-3 items from seller1, 2-4 items from seller2
          const seller1ItemCount = Math.floor(Math.random() * 2) + 2; // 2-3 items
          const seller2ItemCount = Math.floor(Math.random() * 3) + 2; // 2-4 items

          // Add items from seller@gmail.com
          for (let j = 0; j < seller1ItemCount; j++) {
            const product = seller1Products[Math.floor(Math.random() * seller1Products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
            const price = product.price * quantity;

            orderItems.push({
              productId: product._id,
              sellerId: seller1._id,
              quantity,
              price: product.price,
            });

            totalAmount += price;
          }

          // Add items from seller1@gmail.com
          for (let j = 0; j < seller2ItemCount; j++) {
            const product = seller2Products[Math.floor(Math.random() * seller2Products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
            const price = product.price * quantity;

            orderItems.push({
              productId: product._id,
              sellerId: seller2._id,
              quantity,
              price: product.price,
            });

            totalAmount += price;
          }
        } else {
          // Single vendor order
          const isSeller1 = Math.random() > 0.5;
          const products = isSeller1 ? seller1Products : seller2Products;
          const sellerId = isSeller1 ? seller1._id : seller2._id;
          const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items

          for (let j = 0; j < itemCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
            const price = product.price * quantity;

            orderItems.push({
              productId: product._id,
              sellerId: sellerId,
              quantity,
              price: product.price,
            });

            totalAmount += price;
          }
        }

        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const paymentStatus = status === 'CANCELLED' ? 'failed' : 
                             status === 'PENDING' ? 'pending' : 'completed';

        // Random date within the month
        const dayOfMonth = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month overflow
        const createdAt = new Date(monthData.year, monthData.month, dayOfMonth);

        orderCounter++;

        const order = {
          buyerId: buyer._id,
          orderNumber: `ORD${String(orderCounter).padStart(6, '0')}`,
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

        historicalOrders.push(order);
      }
    }

    // Insert all orders
    const insertedOrders = await Order.insertMany(historicalOrders);
    console.log(`\n✅ Created ${insertedOrders.length} historical orders!`);

    // Show summary by month
    console.log('\n📊 Orders Summary by Month:');
    for (const monthData of months) {
      const monthOrders = insertedOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === monthData.month && orderDate.getFullYear() === monthData.year;
      });

      const multiVendorCount = monthOrders.filter(o => {
        const sellerIds = [...new Set(o.orderItems.map(item => item.sellerId.toString()))];
        return sellerIds.length > 1;
      }).length;

      const totalRevenue = monthOrders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      console.log(`\n   ${monthData.name} ${monthData.year}:`);
      console.log(`   - Total Orders: ${monthOrders.length}`);
      console.log(`   - Multi-vendor Orders: ${multiVendorCount}`);
      console.log(`   - Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
      console.log(`   - Status Breakdown:`);
      console.log(`     • Pending: ${monthOrders.filter(o => o.status === 'PENDING').length}`);
      console.log(`     • Processing: ${monthOrders.filter(o => o.status === 'PROCESSING').length}`);
      console.log(`     • Shipped: ${monthOrders.filter(o => o.status === 'SHIPPED').length}`);
      console.log(`     • Delivered: ${monthOrders.filter(o => o.status === 'DELIVERED').length}`);
      console.log(`     • Cancelled: ${monthOrders.filter(o => o.status === 'CANCELLED').length}`);
    }

    console.log('\n✨ Historical orders seeded successfully!');
    console.log('\n🎯 Now you can see analytics data for December, January, February, and March!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedHistoricalOrders();
