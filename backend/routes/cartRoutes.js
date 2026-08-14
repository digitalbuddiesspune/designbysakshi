import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { getDiscountedPrice } from '../utils/pricing.js';

const router = express.Router();

// Helper to build filter for user or guest
const buildOwnerFilter = (userId, guestId) => {
  if (userId) {
    return { user: userId };
  }
  return { guestId };
};

const resolveVariant = (product, variantId) => {
  if (!variantId || !Array.isArray(product?.variants)) return null;
  return product.variants.find((v) => String(v._id) === String(variantId)) || null;
};

const availableStockFor = (product, variant) => {
  if (product && product.inStock === false) return 0;
  if (variant) return Math.max(0, Number(variant.stock || 0));
  return Math.max(0, Number(product?.stock || 0));
};

const sameCartLine = (item, productId, variantId = '') => {
  if (!item || !item.product) return false;
  const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
  return (
    itemProdId === String(productId) &&
    String(item.variantId || '') === String(variantId || '')
  );
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
    const { productId, quantity = 1, userId, guestId, variantId = '' } = req.body;
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

    const normalizedVariantId = String(variantId || '').trim();
    const variant = resolveVariant(product, normalizedVariantId);
    if (normalizedVariantId && !variant) {
      return res.status(400).json({ error: 'Selected variant not found' });
    }

    const filter = buildOwnerFilter(userId, guestId);
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({
        ...filter,
        items: [],
      });
    }

    const existingItem = cart.items.find((item) =>
      sameCartLine(item, productId, normalizedVariantId),
    );

    const addQty = Number(quantity);
    const delta = Number.isFinite(addQty) && addQty > 0 ? addQty : 1;
    const nextQty = (existingItem ? Number(existingItem.quantity || 0) : 0) + delta;
    const available = availableStockFor(product, variant);
    if (nextQty > available) {
      return res.status(400).json({
        error: available <= 0 ? 'Out of stock' : `Only ${available} left in stock`,
      });
    }

    const basePrice = variant ? Number(variant.price) : Number(product.price);
    const unitPrice = getDiscountedPrice(basePrice, product.discountType);

    if (existingItem) {
      existingItem.quantity = nextQty;
      existingItem.priceAtAddTime = unitPrice;
    } else if (delta > 0) {
      cart.items.push({
        product: productId,
        quantity: delta,
        priceAtAddTime: unitPrice,
        variantId: normalizedVariantId,
        variantColor: variant?.color || '',
        variantSize: variant?.size || '',
        variantImage: Array.isArray(variant?.images) && variant.images[0] ? variant.images[0] : '',
      });
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
    const { productId, quantity, userId, guestId, variantId = '' } = req.body;
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

    const normalizedVariantId = String(variantId || '').trim();

    // Remove item if qty <= 0
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (item) => !sameCartLine(item, productId, normalizedVariantId),
      );
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const variant = resolveVariant(product, normalizedVariantId);
      if (normalizedVariantId && !variant) {
        return res.status(400).json({ error: 'Selected variant not found' });
      }
      const available = availableStockFor(product, variant);
      if (qty > available) {
        return res.status(400).json({
          error: available <= 0 ? 'Out of stock' : `Only ${available} left in stock`,
        });
      }

      const existingItem = cart.items.find((item) =>
        sameCartLine(item, productId, normalizedVariantId),
      );
      if (existingItem) {
        existingItem.quantity = qty;
      } else {
        cart.items.push({
          product: productId,
          quantity: qty,
          priceAtAddTime: getDiscountedPrice(
            variant ? Number(variant.price) : Number(product.price),
            product.discountType,
          ),
          variantId: normalizedVariantId,
          variantColor: variant?.color || '',
          variantSize: variant?.size || '',
          variantImage: Array.isArray(variant?.images) && variant.images[0] ? variant.images[0] : '',
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
