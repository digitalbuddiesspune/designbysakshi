import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Helper to build filter for user or guest
const buildOwnerFilter = (userId, guestId) => {
  if (userId) {
    return { user: userId };
  }
  return { guestId };
};

// Get cart for user or guest
router.get('/', async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    const cart = await Cart.findOne(filter).populate('items.product');
    res.json(cart || { items: [] });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1, userId, guestId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({
        ...filter,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Product already in cart: keep single add behavior (do not increase again).
      const populated = await cart.populate('items.product');
      return res.status(200).json(populated);
    } else {
      // Only add if quantity is positive
      if (quantity > 0) {
        cart.items.push({
          product: productId,
          quantity,
          priceAtAddTime: product.price,
        });
      }
    }

    await cart.save();
    const populated = await cart.populate('items.product');
    res.status(200).json(populated);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Set item quantity (absolute)
router.post('/set-quantity', async (req, res) => {
  try {
    const { productId, quantity, userId, guestId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'quantity is required' });
    }
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({ ...filter, items: [] });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty)) {
      return res.status(400).json({ error: 'quantity must be a number' });
    }

    // Remove item if qty <= 0
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity = qty;
      } else {
        // Need product to set priceAtAddTime
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        cart.items.push({
          product: productId,
          quantity: qty,
          priceAtAddTime: product.price,
        });
      }
    }

    await cart.save();
    const populated = await cart.populate('items.product');
    res.status(200).json(populated);
  } catch (error) {
    console.error('Error setting cart quantity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.post('/clear', async (req, res) => {
  try {
    const { userId, guestId } = req.body;
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }
    const filter = buildOwnerFilter(userId, guestId);
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({ ...filter, items: [] });
    } else {
      cart.items = [];
    }
    await cart.save();
    const populated = await cart.populate('items.product');
    res.status(200).json(populated);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

