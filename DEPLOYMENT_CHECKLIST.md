# ✅ Deployment Checklist

## Pre-Deployment Setup

### 🗄️ Database Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (free tier)
- [ ] Create database user with read/write permissions
- [ ] Whitelist all IP addresses (0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection locally

### 🔑 Environment Variables
- [ ] Generate secure JWT secret (32+ characters)
- [ ] Get Razorpay API keys (if using payments)
- [ ] Prepare all environment variables

## Backend Deployment (Render)

### 📤 Code Preparation
- [ ] Commit all changes to Git
- [ ] Push to GitHub repository
- [ ] Ensure `backend/package.json` has correct scripts

### 🖥️ Render Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`

### 🔧 Environment Variables (Render)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `MONGODB_URI=your_mongodb_connection_string`
- [ ] `JWT_SECRET=your_jwt_secret`
- [ ] `RAZORPAY_KEY_ID=your_razorpay_key`
- [ ] `RAZORPAY_KEY_SECRET=your_razorpay_secret`
- [ ] `FRONTEND_URL=https://your-app.vercel.app` (update after frontend deployment)

### 🚀 Deploy Backend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`
- [ ] Note backend URL for frontend configuration

## Frontend Deployment (Vercel)

### 🌐 Vercel Setup
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### 🔧 Environment Variables (Vercel)
- [ ] `VITE_API_URL=https://your-backend.onrender.com`
- [ ] `NODE_ENV=production`

### 🚀 Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Test frontend: `https://your-app.vercel.app`
- [ ] Note frontend URL for backend CORS configuration

## Post-Deployment Configuration

### 🔄 Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Update `FRONTEND_URL` with actual Vercel URL
- [ ] Redeploy backend service
- [ ] Test CORS by accessing frontend

### 🌱 Seed Database
- [ ] Run product seeding: `npm run seed:products`
- [ ] Run advertisement seeding: `npm run seed:ads`
- [ ] Create dermatologist user: `npm run seed:dermatologist`
- [ ] Create admin user if needed

## Testing & Verification

### 🧪 Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] Product browsing works
- [ ] Search functionality works
- [ ] Filters work on recommendations page
- [ ] Cart functionality works (if implemented)
- [ ] Admin dashboard accessible
- [ ] Seller dashboard accessible
- [ ] Dermatologist dashboard accessible

### 🔍 API Tests
- [ ] Test health endpoint: `/health`
- [ ] Test auth endpoints: `/api/auth/login`, `/api/auth/signup`
- [ ] Test product endpoints: `/api/products`
- [ ] Test recommendation endpoint: `/api/recommendations`
- [ ] Test advertisement endpoint: `/api/advertisements/active`

### 🌐 Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Performance & Security

### ⚡ Performance
- [ ] Check Lighthouse scores
- [ ] Verify image loading
- [ ] Test page load speeds
- [ ] Check mobile responsiveness

### 🔒 Security
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] No sensitive data in client-side code

## Monitoring Setup

### 📊 Monitoring
- [ ] Set up Render monitoring/alerts
- [ ] Set up Vercel analytics
- [ ] Set up MongoDB Atlas monitoring
- [ ] Test error logging

## Documentation

### 📝 Documentation
- [ ] Update README with live URLs
- [ ] Document API endpoints
- [ ] Create user guide if needed
- [ ] Update environment variable documentation

## Final Verification

### ✅ Complete System Test
- [ ] Register new user account
- [ ] Complete skin assessment
- [ ] View personalized recommendations
- [ ] Test product filtering
- [ ] Test advertisement system
- [ ] Test role-based access (admin, seller, dermatologist)
- [ ] Test responsive design on mobile

## 🎉 Deployment Complete!

### 📋 Deployment Summary
- **Frontend URL**: https://your-app.vercel.app
- **Backend URL**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas
- **Status**: ✅ Live and functional

### 📞 Next Steps
- [ ] Share URLs with stakeholders
- [ ] Set up domain name (optional)
- [ ] Plan for scaling if needed
- [ ] Set up backup procedures
- [ ] Plan maintenance schedule