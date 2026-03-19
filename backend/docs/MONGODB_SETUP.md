# MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for the Dermora backend.

## What is MongoDB Atlas?

MongoDB Atlas is a fully-managed cloud database service that offers:
- Free tier available (512MB storage)
- Automatic backups
- Built-in security
- Global clusters
- Easy scaling

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up using:
   - Google
   - GitHub
   - Email

### 2. Create a New Cluster

1. After logging in, click "Build a Database"
2. Choose deployment option:
   - **Shared** (Free tier - M0) - Perfect for development
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to your users
3. Click "Create Cluster"

### 3. Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose authentication method: **Password**
4. Enter:
   - Username: `dermora_user` (or your choice)
   - Password: Generate a secure password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### 4. Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: In production, restrict to specific IPs
4. Click "Confirm"

### 5. Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copy the connection string:

```
mongodb+srv://dermora_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Configure Environment Variables

1. In your backend folder, create/edit `.env` file
2. Replace `<password>` with your actual password
3. Add database name after `.net/`:

```env
MONGODB_URI="mongodb+srv://dermora_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dermora?retryWrites=true&w=majority"
```

**Important**: 
- Replace `YOUR_PASSWORD` with the password you created
- Replace `cluster0.xxxxx` with your actual cluster address
- The database name is `dermora` (will be created automatically)

### 7. Test Connection

Start your backend server:

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Dermora Backend Server running on port 5000
```

## Database Structure

MongoDB will automatically create these collections:

- **users**: User accounts with roles
- **accounts**: Better Auth authentication data
- **sessions**: Active user sessions
- **products**: Product listings
- **carts**: Shopping cart items
- **orders**: Order records

## MongoDB Compass (Optional)

For a GUI to view your database:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Use the same connection string
3. Connect and browse your data visually

## Troubleshooting

### Connection Timeout

- Check your IP is whitelisted in Network Access
- Verify connection string is correct
- Check internet connection

### Authentication Failed

- Verify username and password are correct
- Ensure password doesn't contain special characters that need URL encoding
- Check user has proper permissions

### Database Not Created

- MongoDB creates databases automatically on first write
- Try creating a user or product to trigger database creation

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for database users
2. **IP Whitelist**: In production, restrict to specific IPs
3. **Environment Variables**: Never commit `.env` to version control
4. **Regular Backups**: Enable automated backups in Atlas
5. **Monitoring**: Set up alerts for unusual activity

## Upgrading to Production

When ready for production:

1. **Upgrade Cluster**: Consider M10+ for better performance
2. **Enable Backups**: Configure automated backups
3. **Set Up Monitoring**: Enable performance monitoring
4. **Restrict IP Access**: Whitelist only your server IPs
5. **Use Connection Pooling**: Already configured in Mongoose

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
