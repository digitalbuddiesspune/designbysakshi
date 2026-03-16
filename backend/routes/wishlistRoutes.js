import express from 'express';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

const buildOwnerFilter = (userId, guestId) => {
  if (userId) {
    return { user: userId };
  }
  return { guestId };
};

// Get wishlist
router.get('/', async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    const wishlist = await Wishlist.findOne(filter).populate('products');
    res.json(wishlist || { products: [] });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { productId, userId, guestId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    let wishlist = await Wishlist.findOne(filter);
    if (!wishlist) {
      wishlist = new Wishlist({
        ...filter,
        products: [],
      });
    }

    if (!wishlist.products.find((p) => p.toString() === productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populated = await wishlist.populate('products');
    res.status(200).json(populated);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove product from wishlist
router.post('/remove', async (req, res) => {
  try {
    const { productId, userId, guestId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    if (!userId && !guestId) return res.status(400).json({ error: 'userId or guestId is required' });

    const filter = buildOwnerFilter(userId, guestId);
    const wishlist = await Wishlist.findOne(filter);
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
      await wishlist.save();
    }
    const populated = await (wishlist ? wishlist.populate('products') : Promise.resolve({ products: [] }));
    res.status(200).json(populated);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

