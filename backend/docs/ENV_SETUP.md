# Environment Variables Setup Guide

This guide explains all environment variables needed for the Dermora backend.

## Quick Setup

1. Copy the example file:
```bash
cd backend
cp .env.example .env
```

2. Fill in the values as explained below

## Environment Variables Explained

### Database Configuration

#### MONGODB_URI
**Required**: Yes  
**Description**: MongoDB Atlas connection string

**Format:**
```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

**How to get it:**
1. Create a MongoDB Atlas account (see `MONGODB_SETUP.md`)
2. Create a cluster
3. Create a database user
4. Get connection string from "Connect" button
5. Replace `<password>` with your actual password
6. Add database name (e.g., `dermora`) after `.net/`

**Example:**
```env
MONGODB_URI="mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/dermora?retryWrites=true&w=majority"
```

---

### Better Auth Configuration

#### BETTER_AUTH_SECRET
**Required**: Yes  
**Description**: Secret key used for Better Auth encryption and signing

**How to generate:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

**Example:**
```env
BETTER_AUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

**Important:**
- Must be at least 32 characters
- Use different secrets for dev and production
- Never commit to version control

#### BETTER_AUTH_URL
**Required**: Yes  
**Description**: Base URL of your backend server

**Example (Development):**
```env
BETTER_AUTH_URL="http://localhost:5000"
```

**Example (Production):**
```env
BETTER_AUTH_URL="https://api.dermora.com"
```

---

### Razorpay Configuration

#### RAZORPAY_KEY_ID
**Required**: Yes  
**Description**: Your Razorpay API Key ID

**How to get it:**
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to Settings → API Keys
3. Copy the Key ID (starts with `rzp_test_` or `rzp_live_`)

**Example:**
```env
RAZORPAY_KEY_ID="rzp_test_1234567890abcd"
```

#### RAZORPAY_KEY_SECRET
**Required**: Yes  
**Description**: Your Razorpay API Key Secret

**How to get it:**
1. Same location as Key ID
2. Click "Show" to reveal the secret
3. Copy and paste

**Example:**
```env
RAZORPAY_KEY_SECRET="abcdefghijklmnopqrstuvwx"
```

**Important:**
- Keep this secret secure
- Never expose in frontend code
- Use test keys for development

---

### Server Configuration

#### PORT
**Required**: No (defaults to 5000)  
**Description**: Port number for the server

**Example:**
```env
PORT=5000
```

#### NODE_ENV
**Required**: No (defaults to "development")  
**Description**: Environment mode

**Options:**
- `"development"` - Development mode (verbose logging)
- `"production"` - Production mode (minimal logging)

**Example:**
```env
NODE_ENV="development"
```

---

### Optional Configuration

#### FRONTEND_URL
**Required**: No (defaults to http://localhost:5173)  
**Description**: Frontend URL for CORS configuration

**Example:**
```env
FRONTEND_URL="http://localhost:5173"
```

For production:
```env
FRONTEND_URL="https://dermora.com"
```

#### NEON_PROJECT_ID
**Required**: No  
**Description**: Your Neon project ID (for reference only)

**Example:**
```env
NEON_PROJECT_ID="cool-sound-123456"
```

---

## Complete .env Example

### Development Environment

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dermora?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-auth-key-at-least-32-characters-long"
BETTER_AUTH_URL="http://localhost:5000"

# Razorpay (Test Mode)
RAZORPAY_KEY_ID="rzp_test_1234567890abcd"
RAZORPAY_KEY_SECRET="test_secret_key_here"

# Server
PORT=5000
NODE_ENV="development"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Optional
NEON_PROJECT_ID="cool-sound-123456"
```

### Production Environment

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dermora?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="production-secret-different-from-dev-very-long-and-secure"
BETTER_AUTH_URL="https://api.dermora.com"

# Razorpay (Live Mode)
RAZORPAY_KEY_ID="rzp_live_1234567890abcd"
RAZORPAY_KEY_SECRET="live_secret_key_here"

# Server
PORT=5000
NODE_ENV="production"

# Frontend
FRONTEND_URL="https://dermora.com"
```

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Different secrets for dev and production
- [ ] BETTER_AUTH_SECRET is at least 32 characters
- [ ] Razorpay secrets are not exposed in frontend
- [ ] MONGODB_URI includes database name
- [ ] Production uses `rzp_live_` keys
- [ ] `.env.example` has no real credentials

---

## Troubleshooting

### "MONGODB_URI is not defined"

- Check `.env` file exists in backend folder
- Verify variable name is exactly `MONGODB_URI`
- Ensure no spaces around `=`

### "Invalid auth secret"

- BETTER_AUTH_SECRET must be set
- Should be a long random string (at least 32 characters)
- Check for typos or extra spaces

### "Razorpay authentication failed"

- Verify Key ID and Secret are correct
- Check if using correct mode (test/live)
- Ensure no extra spaces in values

### Environment variables not loading

- Install dotenv: `npm install dotenv`
- Import at top of server.js: `import 'dotenv/config'`
- Restart the server after changing .env
