import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import productRoutes from './routes/productRoutes.js';
import roommateRoutes from "./routes/roommateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = [
    'https://uninest-connect.vercel.app',
    /\.vercel\.app$/ // ✅ allow all vercel preview deploys
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      console.log('🔍 Origin received:', origin);
      if (!origin || allowedOrigins.some(entry =>
        typeof entry === 'string' ? origin === entry : entry.test(origin)
      )) {
        callback(null, true);
      } else {
        callback(new Error(`❌ Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true
  }));
  
  
  

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ THIS IS REQUIRED


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('🔥 UniNest Connect backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
