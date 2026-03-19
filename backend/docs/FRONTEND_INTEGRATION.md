# Frontend Integration Guide

Complete guide for integrating the Dermora backend with your React frontend.

## Installation

Install Better Auth client in your frontend:

```bash
cd frontend
npm install better-auth
```

## Setup Auth Client

Create an auth client configuration:

```typescript
// frontend/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "BUYER";
  profileImage?: string;
};
```

## Create Auth Hook

```typescript
// frontend/src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { authClient, User } from "../lib/auth-client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "BUYER" | "SELLER" = "BUYER"
  ) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    });

    if (!error && data) {
      setUser(data.user);
    }

    return { data, error };
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (!error && data) {
      setUser(data.user);
    }

    return { data, error };
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return { user, loading, signup, login, logout };
}
```

## Login Component Example

```typescript
// frontend/src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await login(email, password);

    if (error) {
      setError(error.message || "Login failed");
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## Signup Component Example

```typescript
// frontend/src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signup(name, email, password, role);

    if (error) {
      setError(error.message || "Signup failed");
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="BUYER">Buyer</option>
        <option value="SELLER">Seller</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

## Protected Routes

```typescript
// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "SELLER" | "BUYER")[];
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```

## API Client with Auth

```typescript
// frontend/src/lib/api-client.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Important: sends cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Example: Get products
export async function getProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
}) {
  const query = new URLSearchParams(params as any).toString();
  return apiRequest(`/api/products?${query}`);
}

// Example: Create product
export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}) {
  return apiRequest("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Example: Add to cart
export async function addToCart(productId: string, quantity: number) {
  return apiRequest("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}
```

## Environment Variables

Add to your frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://api.dermora.com
```

## CORS Configuration

The backend is already configured to accept requests from your frontend. Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL:

```env
# Backend .env
FRONTEND_URL=http://localhost:5173
```

## Complete Example: Product Management

```typescript
// frontend/src/pages/SellerDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { createProduct, getProducts } from "../lib/api-client";

export function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct(formData);
      alert("Product created successfully!");
      loadProducts();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
      });
    } catch (error: any) {
      alert(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      <form onSubmit={handleSubmit}>
        <h2>Create New Product</h2>
        
        <input
          type="text"
          placeholder="Product Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
        
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
          required
        />
        
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
        
        <input
          type="url"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>

      <h2>Your Products</h2>
      <div className="products-grid">
        {products.map((product: any) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.title} />
            <h3>{product.title}</h3>
            <p>₹{product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Testing

Test your integration:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Try signing up a new user
4. Try logging in
5. Test protected routes
6. Test API calls

## Troubleshooting

### "Network Error" or CORS issues

- Check backend CORS configuration
- Verify `FRONTEND_URL` in backend `.env`
- Ensure `credentials: "include"` in fetch requests

### Session not persisting

- Check cookies are enabled in browser
- Verify `credentials: "include"` in API calls
- Check backend `trustedOrigins` configuration

### "Unauthorized" errors

- Verify user is logged in
- Check session hasn't expired
- Ensure cookies are being sent with requests

## Next Steps

1. Implement cart functionality
2. Add payment integration with Razorpay
3. Create order management pages
4. Add product search and filters
5. Implement admin dashboard
