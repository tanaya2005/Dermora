// import mongoose from 'mongoose';
// import Product from '../models/Product.js';
// import User from '../models/User.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const products = [
//   {
//     title: "Hydrating Vitamin C Serum",
//     description: "Brighten and hydrate your skin with our powerful Vitamin C serum. Reduces dark spots and evens skin tone for a radiant glow.",
//     price: 2499,
//     stock: 50,
//     category: "Serums",
//     imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"
//   },
//   {
//     title: "Gentle Foaming Cleanser",
//     description: "A mild, pH-balanced cleanser that removes impurities without stripping natural oils. Perfect for all skin types.",
//     price: 1299,
//     stock: 100,
//     category: "Cleansers",
//     imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80"
//   },
//   {
//     title: "Niacinamide 10% + Zinc 1%",
//     description: "Minimize pores and control oil production with this powerful niacinamide formula. Ideal for oily and acne-prone skin.",
//     price: 1899,
//     stock: 75,
//     category: "Serums",
//     imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80"
//   },
//   {
//     title: "Hyaluronic Acid Moisturizer",
//     description: "Deep hydration that lasts all day. This lightweight moisturizer plumps and smooths skin with hyaluronic acid.",
//     price: 2199,
//     stock: 60,
//     category: "Moisturizers",
//     imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"
//   },
//   {
//     title: "Retinol Night Cream",
//     description: "Anti-aging night cream with 0.5% retinol. Reduces fine lines, wrinkles, and improves skin texture while you sleep.",
//     price: 3499,
//     stock: 40,
//     category: "Night Creams",
//     imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500&q=80"
//   },
//   {
//     title: "SPF 50 Sunscreen Lotion",
//     description: "Broad-spectrum protection against UVA and UVB rays. Lightweight, non-greasy formula suitable for daily use.",
//     price: 1599,
//     stock: 120,
//     category: "Sunscreen",
//     imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80"
//   },
//   {
//     title: "Exfoliating AHA/BHA Toner",
//     description: "Gently exfoliate dead skin cells and unclog pores with this dual-action toner. Reveals smoother, brighter skin.",
//     price: 1799,
//     stock: 80,
//     category: "Toners",
//     imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80"
//   },
//   {
//     title: "Collagen Eye Cream",
//     description: "Reduce dark circles and puffiness with this nourishing eye cream. Packed with collagen and peptides.",
//     price: 2799,
//     stock: 55,
//     category: "Eye Care",
//     imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80"
//   },
//   {
//     title: "Charcoal Face Mask",
//     description: "Deep cleansing mask that draws out impurities and toxins. Leaves skin feeling refreshed and purified.",
//     price: 999,
//     stock: 90,
//     category: "Masks",
//     imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80"
//   },
//   {
//     title: "Rose Water Facial Mist",
//     description: "Refreshing and hydrating facial mist with pure rose water. Perfect for setting makeup or midday refresh.",
//     price: 899,
//     stock: 110,
//     category: "Mists",
//     imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80"
//   }
// ];

// async function seedProducts() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ Connected to MongoDB');

//     // Find a seller user or create a default one
//     let seller = await User.findOne({ role: 'SELLER' });
    
//     if (!seller) {
//       console.log('⚠️  No seller found. Creating a default seller...');
//       const { hashPassword } = await import('../utils/hash.js');
//       const hashedPassword = await hashPassword('seller123');
      
//       seller = await User.create({
//         name: 'Dermora Store',
//         email: 'seller@dermora.com',
//         password: hashedPassword,
//         role: 'SELLER',
//         emailVerified: true
//       });
//       console.log('✅ Default seller created: seller@dermora.com / seller123');
//     }

//     // Clear existing products
//     await Product.deleteMany({});
//     console.log('🗑️  Cleared existing products');

//     // Add sellerId to all products
//     const productsWithSeller = products.map(product => ({
//       ...product,
//       sellerId: seller._id
//     }));

//     // Insert products
//     const insertedProducts = await Product.insertMany(productsWithSeller);
//     console.log(`✅ Successfully added ${insertedProducts.length} products!`);

//     console.log('\n📦 Products added:');
//     insertedProducts.forEach((product, index) => {
//       console.log(`${index + 1}. ${product.title} - ₹${product.price}`);
//     });

//     console.log('\n✨ Database seeding completed!');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     process.exit(1);
//   }
// }

// seedProducts();


import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    title: "Minimalist Vitamin C 10% Serum",
    description: "Brightens skin and reduces pigmentation using stabilized Vitamin C.",
    price: 599,
    stock: 80,
    category: "Serums",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
  },
  {
    title: "Mamaearth Ubtan Face Wash",
    description: "Removes tan and brightens skin with turmeric and saffron.",
    price: 299,
    stock: 100,
    category: "Cleansers",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80"
  },
  {
    title: "Plum Green Tea Oil-Free Moisturizer",
    description: "Hydrates oily skin without clogging pores.",
    price: 449,
    stock: 70,
    category: "Moisturizers",
    imageUrl: "https://images.unsplash.com/photo-1556228852-80a5e2c3c0c3?w=800&q=80"
  },
  {
    title: "Dot & Key Sunscreen SPF 50",
    description: "Lightweight sunscreen with broad spectrum protection.",
    price: 499,
    stock: 120,
    category: "Sunscreen",
    imageUrl: "https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=800&q=80"
  },
  {
    title: "Wow Skin Science Aloe Vera Gel",
    description: "Multipurpose soothing gel for skin and hair.",
    price: 349,
    stock: 150,
    category: "Gel",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80"
  },
  {
    title: "Biotique Bio Cucumber Toner",
    description: "Refreshes and tightens pores naturally.",
    price: 249,
    stock: 110,
    category: "Toners",
    imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
  },
  {
    title: "Lakme Peach Milk Moisturizer",
    description: "Nourishes skin for a soft glow.",
    price: 299,
    stock: 90,
    category: "Moisturizers",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"
  },
  {
    title: "Himalaya Neem Face Wash",
    description: "Prevents acne and purifies skin.",
    price: 199,
    stock: 130,
    category: "Cleansers",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
  },
  {
    title: "Forest Essentials Facial Cleanser",
    description: "Luxurious Ayurvedic cleanser for radiant skin.",
    price: 899,
    stock: 50,
    category: "Cleansers",
    imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80"
  },
  {
    title: "Minimalist Niacinamide 10% Serum",
    description: "Controls oil and reduces acne marks.",
    price: 549,
    stock: 85,
    category: "Serums",
    imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80"
  },
  {
    title: "Mamaearth Charcoal Face Mask",
    description: "Detoxifies skin and removes impurities.",
    price: 399,
    stock: 95,
    category: "Masks",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80"
  },
  {
    title: "Plum Vitamin C Serum",
    description: "Boosts glow and improves skin texture.",
    price: 649,
    stock: 60,
    category: "Serums",
    imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80"
  },
  {
    title: "Dot & Key Retinol Night Cream",
    description: "Reduces wrinkles and fine lines overnight.",
    price: 799,
    stock: 45,
    category: "Night Creams",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80"
  },
  {
    title: "Wow Vitamin C Face Wash",
    description: "Brightens dull skin and removes impurities.",
    price: 349,
    stock: 100,
    category: "Cleansers",
    imageUrl: "https://images.unsplash.com/photo-1585155770960-a6eb1cb4e7e8?w=800&q=80"
  },
  {
    title: "Biotique Papaya Scrub",
    description: "Gently exfoliates and removes dead skin.",
    price: 299,
    stock: 80,
    category: "Scrubs",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"
  },
  {
    title: "Lakme Sun Expert SPF 50",
    description: "Protects against sun damage.",
    price: 449,
    stock: 110,
    category: "Sunscreen",
    imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80"
  },
  // {
  //   title: "Himalaya Aloe Vera Gel",
  //   description: "Soothes and hydrates irritated skin.",
  //   price: 249,
  //   stock: 120,
  //   category: "Gel",
  //   imageUrl: "https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=800&q=80"
  // },
  {
    title: "Forest Essentials Night Cream",
    description: "Rich Ayurvedic cream for overnight repair.",
    price: 1099,
    stock: 40,
    category: "Night Creams",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800&q=80"
  },
  // {
  //   title: "Minimalist Hyaluronic Acid Serum",
  //   description: "Deep hydration for plump skin.",
  //   price: 599,
  //   stock: 75,
  //   category: "Serums",
  //   imageUrl: "https://images.unsplash.com/photo-1620916297397-a4a5f7c0d9c3?w=800&q=80"
  // },
  {
    title: "Mamaearth Onion Hair Serum",
    description: "Strengthens hair and reduces hair fall.",
    price: 499,
    stock: 90,
    category: "Hair Care",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80"
  },
  {
    title: "Plum Green Tea Face Mask",
    description: "Fights acne and controls oil.",
    price: 449,
    stock: 85,
    category: "Masks",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
  },
  // {
  //   title: "Dot & Key Vitamin C Face Cream",
  //   description: "Brightens and evens skin tone.",
  //   price: 699,
  //   stock: 60,
  //   category: "Moisturizers",
  //   imageUrl: "https://images.unsplash.com/photo-1556229010-aa9e5d93b2e2?w=800&q=80"
  // },
  {
    title: "Wow Charcoal Face Wash",
    description: "Deep cleanses and detoxifies skin.",
    price: 299,
    stock: 100,
    category: "Cleansers",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
  },
  {
    title: "Biotique Morning Nectar Moisturizer",
    description: "Hydrates and nourishes dry skin.",
    price: 349,
    stock: 95,
    category: "Moisturizers",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
  },
  {
    title: "Lakme Absolute Skin Gloss Gel",
    description: "Lightweight gel for glowing skin.",
    price: 549,
    stock: 70,
    category: "Gel",
    imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let seller = await User.findOne({ role: 'SELLER' });

    if (!seller) {
      const { hashPassword } = await import('../utils/hash.js');
      const hashedPassword = await hashPassword('seller123');

      seller = await User.create({
        name: 'Dermora Store',
        email: 'seller@dermora.com',
        password: hashedPassword,
        role: 'SELLER',
        emailVerified: true
      });

      console.log('✅ Default seller created');
    }

    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    const productsWithSeller = products.map(product => ({
      ...product,
      sellerId: seller._id
    }));

    const insertedProducts = await Product.insertMany(productsWithSeller);

    console.log(`✅ Added ${insertedProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedProducts();