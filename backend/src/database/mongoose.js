import mongoose from 'mongoose';

// Cache connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable mongoose buffering for serverless
      maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error; // Don't exit process in serverless environment
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;
