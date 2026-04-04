import mongoose from 'mongoose';
import Advertisement from '../models/Advertisement.js';
import User from '../models/User.js';
import { config } from 'dotenv';

config();

const sampleAds = [
  {
    title: "Premium Skincare Collection",
    description: "Discover our dermatologist-approved premium skincare line with 30% off for new customers!",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center",
    redirectUrl: "/products?category=premium",
    targetAudience: "all",
    priority: 10,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: "Free Skin Assessment",
    description: "Get personalized skincare recommendations with our AI-powered skin assessment tool.",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center",
    redirectUrl: "/assessment",
    targetAudience: "guest",
    priority: 9,
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
  },
  {
    title: "Member Exclusive Deals",
    description: "Unlock special discounts and early access to new products as a registered member.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop&crop=center",
    redirectUrl: "/products?filter=member-deals",
    targetAudience: "signed_in",
    priority: 8,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
  },
  {
    title: "Dermatologist Consultation",
    description: "Book a virtual consultation with certified dermatologists for personalized advice.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
    redirectUrl: "/consult",
    targetAudience: "all",
    priority: 7,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  },
  {
    title: "Subscribe & Save 20%",
    description: "Never run out of your favorite products. Subscribe and save 20% on every order!",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop&crop=center",
    redirectUrl: "/subscriptions",
    targetAudience: "signed_in",
    priority: 6,
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 120 days from now
  }
];

async function seedAdvertisements() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: 'ADMIN' });
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = new User({
        name: 'Admin',
        email: 'admin@dermora.com',
        password: 'admin123', // You should hash this in production
        role: 'ADMIN',
        emailVerified: true
      });
      await adminUser.save();
      console.log('Created default admin user');
    }

    // Clear existing advertisements
    await Advertisement.deleteMany({});
    console.log('Cleared existing advertisements');

    // Add createdBy field to each ad
    const adsWithCreator = sampleAds.map(ad => ({
      ...ad,
      createdBy: adminUser._id
    }));

    // Insert sample advertisements
    const insertedAds = await Advertisement.insertMany(adsWithCreator);
    console.log(`Inserted ${insertedAds.length} advertisements`);

    // Display inserted ads
    insertedAds.forEach((ad, index) => {
      console.log(`${index + 1}. ${ad.title} (${ad.targetAudience}) - Priority: ${ad.priority}`);
    });

    console.log('Advertisement seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding advertisements:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedAdvertisements();