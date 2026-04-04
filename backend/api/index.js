import 'dotenv/config';
import app from '../src/app.js';
import connectDB from '../src/database/mongoose.js';

// Connect to MongoDB (with connection caching for serverless)
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  cachedConnection = await connectDB();
  return cachedConnection;
}

// Initialize database connection
connectToDatabase().catch(console.error);

// Export the Express app as a serverless function
export default app;