import mongoose from 'mongoose';
import User from '../models/User.js';
import { hashPassword } from '../utils/hash.js';
import { config } from 'dotenv';

config();

async function seedDermatologist() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if dermatologist already exists
    const existingDermatologist = await User.findOne({ 
      email: 'dr.smith@dermora.com',
      role: 'DERMATOLOGIST' 
    });

    if (existingDermatologist) {
      console.log('👩‍⚕️ Dermatologist already exists');
      await mongoose.disconnect();
      return;
    }

    // Create dermatologist user
    const hashedPassword = await hashPassword('doctor123');
    
    const dermatologist = new User({
      name: 'Dr. Sarah Smith',
      email: 'dr.smith@dermora.com',
      password: hashedPassword,
      role: 'DERMATOLOGIST',
      emailVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
    });

    await dermatologist.save();
    
    console.log('✅ Dermatologist user created successfully!');
    console.log('📧 Email: dr.smith@dermora.com');
    console.log('🔑 Password: doctor123');
    console.log('👩‍⚕️ Role: DERMATOLOGIST');

  } catch (error) {
    console.error('❌ Error seeding dermatologist:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDermatologist();