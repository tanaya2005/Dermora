import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';
import User from './src/models/User.js';
import Product from './src/models/Product.js';

dotenv.config();

async function checkSellerOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find seller user
    const seller = await User.findOne({ email: 'seller@gmail.com' });
    if (!seller) {
      console.log('❌ Seller not found with email seller@gmail.com');
      return;
    }
    console.log('✅ Found seller:', seller.name, seller._id);

    // Find seller's products
    const sellerProducts = await Product.find({ sellerId: seller._id });
    console.log(`✅ Seller has ${sellerProducts.length} products`);

    // Find orders containing seller's products
    const orders = await Order.find({
      'orderItems.sellerId': seller._id
    }).populate('buyerId', 'name email');

    console.log(`\n✅ Found ${orders.length} orders with seller's products:\n`);

    orders.forEach(order => {
      const sellerItems = order.orderItems.filter(
        item => item.sellerId.toString() === seller._id.toString()
      );
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      console.log(`Order ${order.orderNumber}:`);
      console.log(`  Buyer: ${order.buyerId.name}`);
      console.log(`  Seller's items: ${sellerItems.length}`);
      console.log(`  Seller's total: ₹${sellerTotal}`);
      console.log(`  Status: ${order.status}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSellerOrders();
