#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 Dermora Deployment Setup Helper\n');

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('🔑 Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Create backend environment template
const backendEnv = `# Backend Environment Variables for Render
NODE_ENV=production
PORT=10000

# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dermora

# JWT Secret - Use the generated one above
JWT_SECRET=${jwtSecret}

# Razorpay Configuration - Replace with your actual keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL - Replace with your Vercel domain after deployment
FRONTEND_URL=https://your-app.vercel.app`;

// Create frontend environment template
const frontendEnv = `# Frontend Environment Variables for Vercel
# Replace with your actual Render backend URL after deployment
VITE_API_URL=https://your-backend-app.onrender.com

# App Environment
NODE_ENV=production`;

// Write environment templates
fs.writeFileSync(path.join(__dirname, 'backend', '.env.render'), backendEnv);
fs.writeFileSync(path.join(__dirname, 'frontend', '.env.vercel'), frontendEnv);

console.log('📝 Created environment variable templates:');
console.log('   - backend/.env.render (for Render deployment)');
console.log('   - frontend/.env.vercel (for Vercel deployment)\n');

console.log('📋 Next Steps:');
console.log('1. Set up MongoDB Atlas and get your connection string');
console.log('2. Get Razorpay API keys (if using payments)');
console.log('3. Update the .env.render file with your actual values');
console.log('4. Deploy backend to Render using the environment variables');
console.log('5. Deploy frontend to Vercel');
console.log('6. Update FRONTEND_URL in Render with your Vercel URL');
console.log('7. Update VITE_API_URL in Vercel with your Render URL\n');

console.log('📖 See DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('✅ See DEPLOYMENT_CHECKLIST.md for step-by-step checklist');

// Check if git is initialized
if (!fs.existsSync('.git')) {
  console.log('\n⚠️  Git repository not found. Initialize with:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit"');
  console.log('   git branch -M main');
  console.log('   git remote add origin https://github.com/yourusername/dermora.git');
  console.log('   git push -u origin main');
}