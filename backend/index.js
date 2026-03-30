import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
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

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
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

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} `);
            console.log("Mongodb is connected")
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
