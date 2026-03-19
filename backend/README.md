# Dermora Backend API

Production-ready backend for Dermora, a multi-vendor skincare marketplace platform.

## Features

- **Authentication**: Better Auth with role-based access control (Admin, Seller, Buyer)
- **Product Management**: Full CRUD operations for skincare products
- **Shopping Cart**: Add, view, and remove items from cart
- **Order Management**: Create and track orders
- **Payment Integration**: Razorpay payment gateway integration
- **Database**: PostgreSQL with Prisma ORM (NeonDB)
- **Security**: bcrypt password hashing, helmet, CORS
- **Validation**: Zod schema validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: Better Auth
- **Payments**: Razorpay
- **Validation**: Zod
- **Security**: helmet, cors

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Server runs at `http://localhost:5000`

## Documentation

Detailed setup guides are available in the `/docs` folder:

- **[RUN_PROJECT.md](docs/RUN_PROJECT.md)** - Complete setup and running guide
- **[ENV_SETUP.md](docs/ENV_SETUP.md)** - Environment variables configuration
- **[MONGODB_SETUP.md](docs/MONGODB_SETUP.md)** - Database setup with MongoDB Atlas
- **[BETTER_AUTH_SETUP.md](docs/BETTER_AUTH_SETUP.md)** - Better Auth setup and usage guide
- **[RAZORPAY_SETUP.md](docs/RAZORPAY_SETUP.md)** - Payment integration guide

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, roles, error handling
│   ├── routes/          # API routes
│   ├── services/        # Business logic (payments)
│   ├── database/        # Prisma client
│   ├── utils/           # JWT, hashing utilities
│   ├── validators/      # Zod schemas
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── docs/               # Documentation
└── .env.example        # Environment template
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `POST /api/products` - Create product (Seller)
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)

### Cart
- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart
- `DELETE /api/cart/:itemId` - Remove from cart

### Orders
- `POST /api/orders/create` - Create order
- `GET /api/orders/user` - User orders
- `GET /api/orders/seller` - Seller orders
- `GET /api/orders/admin` - All orders (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## Environment Variables

Required variables (see `.env.example`):

```env
MONGODB_URI=           # MongoDB Atlas connection string
BETTER_AUTH_SECRET=    # Better Auth secret
BETTER_AUTH_URL=       # Backend URL
RAZORPAY_KEY_ID=       # Razorpay key ID
RAZORPAY_KEY_SECRET=   # Razorpay secret
PORT=5000              # Server port
NODE_ENV=development   # Environment mode
```

## Scripts

```bash
npm run dev              # Development with auto-reload
npm start                # Production server
```

## Security Features

- Better Auth with automatic password hashing
- Session-based authentication with httpOnly cookies
- Role-based access control
- Helmet security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Mongoose)

## License

ISC
