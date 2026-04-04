# 🚀 Deployment Guide - Dermora Platform

This guide will help you deploy the Dermora platform with the frontend on Vercel and backend on Render.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

## 🗄️ **Step 1: Setup MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dermora`

## 🖥️ **Step 2: Deploy Backend to Render**

### 2.1 Push Code to GitHub
```bash
# If not already done
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch
5. Configure the service:
   - **Name**: `dermora-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables
In Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dermora
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-app.vercel.app
```

### 2.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL: `https://your-backend-app.onrender.com`

## 🌐 **Step 3: Deploy Frontend to Vercel**

### 3.1 Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Set Environment Variables
In Vercel dashboard, add these environment variables:

```env
VITE_API_URL=https://your-backend-app.onrender.com
NODE_ENV=production
```

### 3.3 Deploy
- Click "Deploy"
- Wait for deployment to complete
- Note your frontend URL: `https://your-app.vercel.app`

## 🔄 **Step 4: Update Backend with Frontend URL**

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL
3. Redeploy the backend service

## 🌱 **Step 5: Seed Initial Data**

After both deployments are complete, seed your database:

### 5.1 Seed Products
```bash
# Run this locally with production MongoDB URI
MONGODB_URI="your_production_mongodb_uri" npm run seed:products
```

### 5.2 Seed Advertisements
```bash
MONGODB_URI="your_production_mongodb_uri" npm run seed:ads
```

### 5.3 Create Admin User
```bash
MONGODB_URI="your_production_mongodb_uri" npm run seed:dermatologist
```

## ✅ **Step 6: Test Your Deployment**

1. Visit your Vercel URL
2. Test user registration and login
3. Test product browsing
4. Test the recommendation system
5. Test admin/seller/dermatologist dashboards

## 🔧 **Environment Variables Reference**

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dermora
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-app.onrender.com
NODE_ENV=production
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that Vercel URL matches exactly

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json

4. **API Not Working**
   - Verify `VITE_API_URL` points to correct Render URL
   - Check backend logs in Render dashboard

### Useful Commands:

```bash
# Test backend health
curl https://your-backend-app.onrender.com/health

# Check frontend build locally
cd frontend && npm run build

# Check backend start locally
cd backend && npm start
```

## 🔄 **Continuous Deployment**

Both Vercel and Render support automatic deployments:

- **Vercel**: Automatically deploys on push to main branch
- **Render**: Enable auto-deploy in service settings

## 📊 **Monitoring**

- **Render**: Built-in logs and metrics
- **Vercel**: Analytics and performance monitoring
- **MongoDB Atlas**: Database monitoring and alerts

## 🎉 **Success!**

Your Dermora platform should now be live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend-app.onrender.com

## 📞 **Support**

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas connection and permissions