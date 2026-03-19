import mongoose from 'mongoose';
import User from '../models/User.js';
import { hashPassword } from '../utils/hash.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      if (!user.password) {
        console.log(`User ${user.email} has no password - deleting...`);
        await User.deleteOne({ _id: user._id });
      } else {
        console.log(`User ${user.email} - OK`);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUsers();
