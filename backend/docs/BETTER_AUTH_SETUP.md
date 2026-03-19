# Better Auth Setup Guide

This guide explains how Better Auth is configured in Dermora and how to use it.

## What is Better Auth?

Better Auth is a modern, framework-agnostic authentication library that provides:
- Email/password authentication
- Session management
- Built-in security features
- Type-safe API
- Easy integration with Prisma
- Social auth support (optional)

## Why Better Auth?

- **Modern**: Built for modern web applications
- **Secure**: Automatic password hashing, CSRF protection
- **Flexible**: Works with any framework
- **Type-safe**: Full TypeScript support
- **Simple**: Less boilerplate than custom JWT solutions

## Configuration

Better Auth is configured in `src/lib/auth.js`:

```javascript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "BUYER",
      },
      profileImage: {
        type: "string",
        required: false,
      },
    },
  },
});
```

## Environment Variables

Add to your `.env` file:

```env
BETTER_AUTH_SECRET="your-generated-secret-here"
BETTER_AUTH_URL="http://localhost:5000"
```

### Generate Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Database Schema

Better Auth requires these tables (already in schema.prisma):

- **user**: User accounts with custom fields (role, profileImage)
- **session**: Active user sessions
- **account**: Authentication accounts (stores hashed passwords)
- **verification**: Email verification tokens (if enabled)

## API Endpoints

### POST /api/auth/signup

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "BUYER",
  "profileImage": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER",
    "emailVerified": false
  },
  "session": {
    "id": "session_...",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

### POST /api/auth/login

Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

### GET /api/auth/me

Get current authenticated user.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER"
  }
}
```

### POST /api/auth/logout

Logout current user.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Frontend Integration

### Install Better Auth Client

```bash
npm install better-auth
```

### Create Auth Client

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000",
});
```

### Sign Up

```typescript
const handleSignup = async () => {
  const { data, error } = await authClient.signUp.email({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "BUYER",
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log("User created:", data.user);
};
```

### Sign In

```typescript
const handleLogin = async () => {
  const { data, error } = await authClient.signIn.email({
    email: "john@example.com",
    password: "password123",
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log("Logged in:", data.user);
};
```

### Get Current User

```typescript
const { data: session } = await authClient.getSession();

if (session) {
  console.log("Current user:", session.user);
}
```

### Sign Out

```typescript
await authClient.signOut();
```

### React Hook Example

```typescript
import { useEffect, useState } from "react";
import { authClient } from "./lib/auth-client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (!error) {
      setUser(data.user);
    }

    return { data, error };
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

## Role-Based Access Control

Better Auth stores the custom `role` field. Use it in your middleware:

```javascript
// backend/src/middleware/roleMiddleware.js
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};
```

## Session Management

Better Auth handles sessions automatically:

- **Cookie-based**: Sessions stored in httpOnly cookies
- **Secure**: CSRF protection built-in
- **Automatic refresh**: Sessions refresh automatically
- **Expiration**: Configurable session lifetime

## Security Features

1. **Password Hashing**: Automatic bcrypt hashing
2. **CSRF Protection**: Built-in CSRF tokens
3. **Session Security**: httpOnly, secure cookies
4. **Rate Limiting**: Built-in protection (configurable)
5. **SQL Injection**: Protected via Prisma

## Email Verification (Optional)

To enable email verification:

1. Set up email service (e.g., Resend, SendGrid)
2. Update auth config:

```javascript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  sendVerificationEmail: async ({ user, url }) => {
    // Send email with verification link
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `Click here to verify: ${url}`,
    });
  },
}
```

## Social Authentication (Optional)

Better Auth supports OAuth providers:

```javascript
import { google, github } from "better-auth/providers";

export const auth = betterAuth({
  // ... other config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

## Troubleshooting

### "Session not found"

- Check if cookies are being sent
- Verify BETTER_AUTH_URL matches your domain
- Check CORS configuration

### "Invalid credentials"

- Verify email and password are correct
- Check if user exists in database
- Review account table in Prisma Studio

### "CSRF token mismatch"

- Ensure frontend and backend URLs match
- Check CORS configuration
- Verify cookies are enabled

## Migration from JWT

If migrating from JWT-based auth:

1. Users need to re-login (sessions are different)
2. Update frontend to use Better Auth client
3. Remove old JWT middleware
4. Update protected routes to use new middleware

## Additional Resources

- [Better Auth Documentation](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Prisma Adapter](https://better-auth.com/docs/adapters/prisma)
