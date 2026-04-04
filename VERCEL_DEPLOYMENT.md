# Vercel Deployment Guide

## Overview
This project is configured to deploy both frontend and backend on Vercel as a monorepo.

## Project Structure
```
├── frontend/          # React + Vite frontend
├── backend/           # Express.js backend
│   └── api/
│       └── index.js   # Serverless function entry point
└── vercel.json        # Vercel configuration
```

## Environment Variables

### Required Environment Variables in Vercel Dashboard:

#### Backend Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay API key (optional)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key (optional)
- `NODE_ENV` - Set to "production"

#### Frontend Variables:
- `VITE_API_URL` - Set to your Vercel domain (e.g., "https://your-app.vercel.app")

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required variables listed above

4. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - First deployment might take 2-3 minutes

## API Routes
All backend routes will be available at:
- `https://your-app.vercel.app/api/auth/*`
- `https://your-app.vercel.app/api/products/*`
- `https://your-app.vercel.app/api/orders/*`
- etc.

## Frontend
The React app will be served from the root:
- `https://your-app.vercel.app/`

## Notes
- MongoDB connection is optimized for serverless with connection caching
- CORS is configured to allow Vercel preview URLs
- Build process handles both frontend and backend automatically