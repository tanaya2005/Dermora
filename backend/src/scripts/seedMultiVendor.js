import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { hashPassword } from '../utils/hash.js';

dotenv.config();

// Products for seller1@gmail.com
const seller1Products = [
  {
    title: "The Ordinary Niacinamide 10% + Zinc 1%",
    description: "High-strength vitamin and mineral blemish formula. Reduces appearance of blemishes and congestion.",
    price: 599,
    stock: 100,
    category: "Serums",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
  },
  {
    title: "CeraVe Hydrating Facial Cleanser",
    description: "Gentle cleanser with ceramides and hyaluronic acid. Developed with dermatologists.",
    price: 899,
    stock: 80,
    category: "Cleansers",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80"
  },
  {
    title: "La Roche-Posay Effaclar Duo+",
    description: "Anti-blemish treatment with niacinamide. Reduces marks and prevents recurrence.",
    price: 1299,
    stock: 60,
    category: "Treatment",
    ageGroup: "teen",
    imageUrl: "https://images.unsplash.com/photo-1556228852-80a5e2c3c0c3?w=800&q=80"
  },
  {
    title: "Neutrogena Hydro Boost Water Gel",
    description: "Oil-free moisturizer with hyaluronic acid. Instantly quenches dry skin.",
    price: 749,
    stock: 90,
    category: "Moisturizers",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"
  },
  {
    title: "Paula's Choice 2% BHA Liquid Exfoliant",
    description: "Gentle leave-on exfoliant with salicylic acid. Unclogs pores and smooths wrinkles.",
    price: 1599,
    stock: 50,
    category: "Exfoliants",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
  },
  {
    title: "Bioderma Sensibio H2O Micellar Water",
    description: "Gentle cleansing and makeup removing water. Perfect for sensitive skin.",
    price: 999,
    stock: 70,
    category: "Cleansers",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
  },
  {
    title: "Drunk Elephant C-Firma Vitamin C Serum",
    description: "Potent vitamin C day serum. Firms, brightens, and improves signs of photoaging.",
    price: 2499,
    stock: 40,
    category: "Serums",
    ageGroup: "adult",
    imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80"
  },
  {
    title: "Glossier Milky Jelly Cleanser",
    description: "Conditioning face wash with a pH-balanced formula. Removes makeup and dirt.",
    price: 1199,
    stock: 85,
    category: "Cleansers",
    ageGroup: "teen",
    imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80"
  }
];

const seedMultiVendor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ═══════════════════════════════════════════════════════════
    // STEP 1: Create or find seller1@gmail.com
    // ═══════════════════════════════════════════════════════════
    let seller1 = await User.findOne({ email: 'seller1@gmail.com' });
    
    if (!seller1) {
      console.log('⚠️  seller1@gmail.com not found. Creating...');
      const hashedPassword = await hashPassword('password123');
      
      seller1 = await User.create({
        name: 'Premium Seller',
        email: 'seller1@gmail.com',
        password: hashedPassword,
        role: 'SELLER',
        emailVerified: true
      });
      console.log('✅ seller1@gmail.com created');
    } else {
      console.log('✅ Found seller1@gmail.com:', seller1.name);
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Add products for seller1@gmail.com
    // ═══════════════════════════════════════════════════════════
    console.log('\n📦 Adding products for seller1@gmail.com...');
    
    const productsWithSeller1 = seller1Products.map(product => ({
      ...product,
      sellerId: seller1._id
    }));

    const insertedProducts = await Product.insertMany(productsWithSeller1);
    console.log(`✅ Added ${insertedProducts.length} products for seller1@gmail.com`);
    
    console.log('\n📦 Sample products from seller1@gmail.com:');
    insertedProducts.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - ₹${product.price}`);
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Get seller@gmail.com and their products
    // ═══════════════════════════════════════════════════════════
    const mainSeller = await User.findOne({ email: 'seller@gmail.com' });
    
    if (!mainSeller) {
      console.log('❌ seller@gmail.com not found! Please run seedProducts.js first.');
      process.exit(1);
    }

    const mainSellerProducts = await Product.find({ sellerId: mainSeller._id }).limit(10);
    
    if (mainSellerProducts.length === 0) {
      console.log('❌ No products found for seller@gmail.com! Please run seedProducts.js first.');
      process.exit(1);
    }

    console.log(`\n✅ Found ${mainSellerProducts.length} products for seller@gmail.com`);

    // ═══════════════════════════════════════════════════════════
    // STEP 4: Create or find buyer tanayaitis@gmail.com
    // ═══════════════════════════════════════════════════════════
    let buyer = await User.findOne({ email: 'tanayaitis@gmail.com' });
    
    if (!buyer) {
      console.log('\n⚠️  tanayaitis@gmail.com not found. Creating...');
      const hashedPassword = await hashPassword('password123');
      
      buyer = await User.create({
        name: 'Tanaya',
        email: 'tanayaitis@gmail.com',
        password: hashedPassword,
        role: 'BUYER',
        emailVerified: true
      });
      console.log('✅ tanayaitis@gmail.com created');
    } else {
      console.log('\n✅ Found buyer:', buyer.name, `(${buyer.email})`);
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 5: Create multi-vendor orders
    // ═══════════════════════════════════════════════════════════
    console.log('\n🛒 Creating multi-vendor orders...');

    const existingOrderCount = await Order.countDocuments();
    const multiVendorOrders = [];

    // Order 1: 2 products from seller1 + 3 products from seller@gmail.com
    const order1Items = [];
    let order1Total = 0;

    // Add 2 products from seller1@gmail.com
    for (let i = 0; i < 2; i++) {
      const product = insertedProducts[i];
      const quantity = 1;
      order1Items.push({
        productId: product._id,
        sellerId: seller1._id,
        quantity,
        price: product.price,
      });
      order1Total += product.price * quantity;
    }

    // Add 3 products from seller@gmail.com
    for (let i = 0; i < 3; i++) {
      const product = mainSellerProducts[i];
      const quantity = 1;
      order1Items.push({
        productId: product._id,
        sellerId: mainSeller._id,
        quantity,
        price: product.price,
      });
      order1Total += product.price * quantity;
    }

    multiVendorOrders.push({
      buyerId: buyer._id,
      orderNumber: `ORD${String(existingOrderCount + 1).padStart(6, '0')}`,
      totalAmount: order1Total,
      status: 'PROCESSING',
      paymentStatus: 'completed',
      orderItems: order1Items,
      shippingAddress: {
        street: '843 MG Road',
        city: 'Bangalore',
        state: 'Maharashtra',
        pincode: '936751',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Order 2: Another multi-vendor order (3 from seller1, 2 from seller@gmail.com)
    const order2Items = [];
    let order2Total = 0;

    // Add 3 products from seller1@gmail.com
    for (let i = 2; i < 5; i++) {
      const product = insertedProducts[i];
      const quantity = 1;
      order2Items.push({
        productId: product._id,
        sellerId: seller1._id,
        quantity,
        price: product.price,
      });
      order2Total += product.price * quantity;
    }

    // Add 2 products from seller@gmail.com
    for (let i = 3; i < 5; i++) {
      const product = mainSellerProducts[i];
      const quantity = 1;
      order2Items.push({
        productId: product._id,
        sellerId: mainSeller._id,
        quantity,
        price: product.price,
      });
      order2Total += product.price * quantity;
    }

    multiVendorOrders.push({
      buyerId: buyer._id,
      orderNumber: `ORD${String(existingOrderCount + 2).padStart(6, '0')}`,
      totalAmount: order2Total,
      status: 'DELIVERED',
      paymentStatus: 'completed',
      orderItems: order2Items,
      shippingAddress: {
        street: '843 MG Road',
        city: 'Bangalore',
        state: 'Maharashtra',
        pincode: '936751',
      },
      trackingNumber: 'TRK' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(),
    });

    // Order 3: Shipped order (1 from seller1, 4 from seller@gmail.com)
    const order3Items = [];
    let order3Total = 0;

    // Add 1 product from seller1@gmail.com
    const product1 = insertedProducts[5];
    order3Items.push({
      productId: product1._id,
      sellerId: seller1._id,
      quantity: 2,
      price: product1.price,
    });
    order3Total += product1.price * 2;

    // Add 4 products from seller@gmail.com
    for (let i = 5; i < 9; i++) {
      const product = mainSellerProducts[i % mainSellerProducts.length];
      const quantity = 1;
      order3Items.push({
        productId: product._id,
        sellerId: mainSeller._id,
        quantity,
        price: product.price,
      });
      order3Total += product.price * quantity;
    }

    multiVendorOrders.push({
      buyerId: buyer._id,
      orderNumber: `ORD${String(existingOrderCount + 3).padStart(6, '0')}`,
      totalAmount: order3Total,
      status: 'SHIPPED',
      paymentStatus: 'completed',
      orderItems: order3Items,
      shippingAddress: {
        street: '843 MG Road',
        city: 'Bangalore',
        state: 'Maharashtra',
        pincode: '936751',
      },
      trackingNumber: 'TRK' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(),
    });

    // Insert all orders
    const insertedOrders = await Order.insertMany(multiVendorOrders);
    console.log(`✅ Created ${insertedOrders.length} multi-vendor orders for tanayaitis@gmail.com`);

    // Show order details
    console.log('\n📊 Multi-Vendor Order Details:');
    insertedOrders.forEach((order, index) => {
      const seller1Items = order.orderItems.filter(item => item.sellerId.toString() === seller1._id.toString());
      const mainSellerItems = order.orderItems.filter(item => item.sellerId.toString() === mainSeller._id.toString());
      
      console.log(`\n   Order ${index + 1}: ${order.orderNumber}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: ₹${order.totalAmount}`);
      console.log(`   - seller1@gmail.com: ${seller1Items.length} items`);
      console.log(`   - seller@gmail.com: ${mainSellerItems.length} items`);
    });

    console.log('\n✨ Multi-vendor test data created successfully!');
    console.log('\n🎯 Test Instructions:');
    console.log('   1. Login as admin');
    console.log('   2. Go to /admin/orders');
    console.log('   3. Click on any of the new orders');
    console.log('   4. You should see sub-orders breakdown by seller');
    console.log('   5. Platform commission (15%) should be calculated per seller');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedMultiVendor();
