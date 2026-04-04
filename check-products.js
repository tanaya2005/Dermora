const mongoose = require('mongoose');
require('dotenv').config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    const totalProducts = await Product.countDocuments();
    console.log('📦 Total Products in Database:', totalProducts);
    
    const adultProducts = await Product.countDocuments({ 
      ageGroup: { $in: ['adult', 'teen', 'all-ages'] } 
    });
    console.log('👩 Adult/Teen Products:', adultProducts);
    
    const babyProducts = await Product.countDocuments({ ageGroup: 'infant' });
    console.log('👶 Baby Products:', babyProducts);
    
    const categories = await Product.distinct('category');
    console.log('📋 Categories:', categories);
    
    // Show some sample products
    const sampleProducts = await Product.find().limit(5).select('title category ageGroup price');
    console.log('\n🔍 Sample Products:');
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.category} (${product.ageGroup}) - ₹${product.price}`);
    });
    
    // Show baby products specifically
    const babyProductsSample = await Product.find({ ageGroup: 'infant' }).limit(3).select('title category price');
    console.log('\n👶 Baby Products Sample:');
    babyProductsSample.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.category} - ₹${product.price}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Database check completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProducts();