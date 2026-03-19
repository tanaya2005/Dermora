# Dermora - Skincare Marketplace Platform

A full-stack skincare marketplace built with React, Node.js, MongoDB, and Better Auth.

## 🚀 Features

- **Multi-vendor marketplace** - Buyers, Sellers, and Admins
- **Better Auth integration** - Secure authentication with session management
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **Role-based access control** - Different permissions for each user type
- **Product management** - Full CRUD operations for products
- **Shopping cart & orders** - Complete e-commerce functionality
- **Payment integration** - Razorpay payment gateway (optional)
- **Responsive design** - Works on all devices
- **Dark mode support** - Toggle between light and dark themes

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** with **Mongoose**
- **Better Auth** for authentication
- **Razorpay** for payments
- **Zod** for validation

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Better Auth Client** for authentication
- **React Router** for navigation

## 📦 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dermora
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI="your-mongodb-atlas-connection-string"
BETTER_AUTH_SECRET="your-32-character-secret"
BETTER_AUTH_URL="http://localhost:5000"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend server:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (free tier available)
3. Create database user and whitelist IP
4. Get connection string and add to backend `.env`

See `backend/docs/MONGODB_SETUP.md` for detailed instructions.

### Better Auth Setup

1. Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Add to backend `.env`:
```env
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:5000"
```

See `backend/docs/BETTER_AUTH_SETUP.md` for detailed instructions.

### Razorpay Setup (Optional)

1. Create account at [Razorpay](https://razorpay.com)
2. Get test API keys from dashboard
3. Add to backend `.env`

See `backend/docs/RAZORPAY_SETUP.md` for detailed instructions.

## 👥 User Roles

### Buyer
- Browse and search products
- Add items to cart
- Place orders
- View order history

### Seller
- Create and manage products
- View seller dashboard
- Track sales and orders

### Admin
- Manage all users and products
- View admin dashboard
- Access system analytics

## 🔐 Authentication Flow

1. **Registration**: Users sign up with email/password and choose role
2. **Login**: Better Auth handles secure authentication
3. **Session Management**: httpOnly cookies for security
4. **Role-based Access**: Routes protected based on user role

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)

### Cart & Orders
- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart items
- `POST /api/orders/create` - Create order
- `GET /api/orders/user` - Get user orders

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Railway, Render, or Vercel
- Set environment variables in deployment platform
- Ensure MongoDB Atlas is accessible

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Set `VITE_API_URL` to your backend URL
- Build with `npm run build`

## 📚 Documentation

- **Backend Setup**: `backend/docs/`
- **API Reference**: `backend/docs/API_REFERENCE.md`
- **Environment Setup**: `backend/docs/ENV_SETUP.md`
- **MongoDB Setup**: `backend/docs/MONGODB_SETUP.md`
- **Better Auth Guide**: `backend/docs/BETTER_AUTH_SETUP.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:

1. Check the documentation in `/docs` folders
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas connection is working
4. Check browser console and server logs for errors

## 🎯 Next Steps

- [ ] Add product reviews and ratings
- [ ] Implement real-time notifications
- [ ] Add advanced search and filtering
- [ ] Implement inventory management
- [ ] Add analytics dashboard
- [ ] Mobile app development