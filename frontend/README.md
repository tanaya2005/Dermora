# Dermora Frontend

React frontend for Dermora - Skincare Marketplace Platform.

## Features

- ✅ Better Auth integration for authentication
- ✅ Role-based access control (Admin, Seller, Buyer)
- ✅ Product browsing and management
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Seller dashboard for product management
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Create .env file
VITE_API_URL=http://localhost:5000
```

3. **Start development server:**
```bash
npm run dev
```

## Authentication

The frontend uses Better Auth client to communicate with the backend:

- **Login/Register**: Email and password authentication
- **Session Management**: Automatic session handling with httpOnly cookies
- **Role-based Routes**: Protected routes based on user roles

## API Integration

All API calls are handled through `src/lib/api-client.ts`:

- **Products**: Browse, search, and filter products
- **Cart**: Add, remove, and manage cart items
- **Orders**: Create and view orders
- **Authentication**: Login, register, logout

## Components

### Authentication
- `useAuth` hook for authentication state
- `ProtectedRoute` component for role-based access
- Login and Register pages

### Products
- Product listing with search and filters
- Seller dashboard for product management
- Shopping cart functionality

### UI Components
- Responsive navbar with user authentication status
- Dark mode toggle
- Loading states and error handling

## Routing

- `/` - Home page
- `/products` - Product listing
- `/login` - Login page
- `/register` - Registration page
- `/cart` - Shopping cart (protected)
- `/orders` - Order history (protected)
- `/seller/dashboard` - Seller dashboard (seller only)
- `/admin` - Admin dashboard (admin only)

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Integration with Backend

The frontend is configured to work with the Dermora backend:

1. **API Base URL**: Set via `VITE_API_URL` environment variable
2. **Authentication**: Better Auth client handles session management
3. **CORS**: Backend configured to accept requests from frontend
4. **Cookies**: Session cookies automatically sent with requests

## Next Steps

1. Add payment integration (Razorpay)
2. Implement real-time cart updates
3. Add product reviews and ratings
4. Implement advanced search and filtering
5. Add admin analytics dashboard