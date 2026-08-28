import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import Product from './models/Product.js'
import { JEWELLERY_CARE } from './constants/jewelleryCare.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import bannerRoutes from './routes/bannerRoutes.js'
import collectionShowcaseRoutes from './routes/collectionShowcaseRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import homepageSectionRoutes from './routes/homepageSectionRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'

const backfillJewelleryCare = async () => {
  try {
    const result = await Product.updateMany(
      {
        $or: [
          { careInstructions: { $exists: false } },
          { careInstructions: { $size: 0 } },
          { careTitle: { $exists: false } },
          { careTitle: '' },
        ],
      },
      {
        $set: {
          careTitle: JEWELLERY_CARE.title,
          careDescription: JEWELLERY_CARE.description,
          careInstructions: JEWELLERY_CARE.careInstructions,
        },
      },
    );
    if (result.modifiedCount > 0) {
      console.log(`Jewellery care applied to ${result.modifiedCount} existing products`);
    }
  } catch (error) {
    console.error('Failed to backfill jewellery care:', error.message);
  }
};

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware — comma-separated origins in CORS_ORIGIN env var
const allowedOrigins = (process.env.CORS_ORIGIN
  || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/collection-showcase', collectionShowcaseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/homepage-sections', homepageSectionRoutes);
app.use('/api/settings', settingsRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        await backfillJewelleryCare();
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Mongodb is connected');
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Stop the other app or set PORT in .env (e.g. PORT=5001).`);
            } else {
                console.error('Failed to start server:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
