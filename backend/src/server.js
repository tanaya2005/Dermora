import 'dotenv/config';
import app from './app.js';
import connectDB from './database/mongoose.js';

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n📝 Please check your .env file and ensure all required variables are set.');
  console.error('📖 See docs/ENV_SETUP.md for detailed setup instructions.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Dermora Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Show configuration status
  console.log('\n📋 Configuration Status:');
  console.log(`   ✅ MongoDB: Connected`);
  console.log(`   ✅ JWT: ${process.env.JWT_SECRET ? 'Configured' : '❌ Missing'}`);
  console.log(`   ${process.env.RAZORPAY_KEY_ID ? '✅' : '⚠️ '} Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured (payments disabled)'}`);
});
