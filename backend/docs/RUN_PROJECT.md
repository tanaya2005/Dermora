# Running the Dermora Backend

This guide will help you get the Dermora backend up and running.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)
- **MongoDB Atlas account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Razorpay account** - [Sign up](https://razorpay.com)

## Step-by-Step Setup

### 1. Navigate to Backend Folder

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js
- Prisma
- bcrypt
- jsonwebtoken
- Razorpay SDK
- And more...

### 3. Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your credentials:

```env
MONGODB_URI="your-mongodb-atlas-connection-string"
JWT_SECRET="your-generated-secret"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
PORT=5000
NODE_ENV="development"
```

See `ENV_SETUP.md` for detailed instructions on each variable.

### 4. Start the Server

```bash
npm run dev
```

You should see:

```
🚀 Dermora Backend Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
```

### 6. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Push schema without migrations
npm run prisma:push

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Testing the API

### Create a Test User

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "BUYER"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned token for authenticated requests.

### Create a Product (as Seller)

First, create a seller account, then:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Vitamin C Serum",
    "description": "Brightening serum with 20% Vitamin C",
    "price": 2999,
    "stock": 50,
    "category": "Serums",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `POST /api/products` - Create product (Seller)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user's cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/seller` - Get seller's orders
- `GET /api/orders/admin` - Get all orders (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## Troubleshooting

### Port Already in Use

If port 5000 is busy, change it in `.env`:

```env
PORT=3000
```

### Database Connection Error

- Verify MONGODB_URI is correct
- Check internet connection
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### Module Not Found Errors

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Use MongoDB Compass

View and edit database records visually:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MONGODB_URI
3. Browse collections and documents

### Enable Detailed Logging

In `.env`:

```env
NODE_ENV="development"
```

### Test with Postman

Import the API endpoints into Postman for easier testing.

## Production Deployment

### Environment Setup

1. Set `NODE_ENV="production"`
2. Use production MONGODB_URI
3. Use Razorpay live keys
4. Set secure BETTER_AUTH_SECRET
5. Enable HTTPS

### Recommended Platforms

- **Vercel** - Easy deployment
- **Railway** - Simple setup
- **Render** - Free tier available
- **AWS/GCP/Azure** - Full control

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Error logging set up
- [ ] Rate limiting enabled
- [ ] Security headers configured

## Next Steps

1. Read `MONGODB_SETUP.md` for database setup
2. Read `RAZORPAY_SETUP.md` for payment integration
3. Connect your frontend to the API
4. Test all endpoints thoroughly
5. Deploy to production

## Support

For issues or questions:
- Check the documentation in `/docs`
- Review error logs
- Verify environment variables
- Test with MongoDB Compass
