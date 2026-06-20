import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

const verifyToken = (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    res.status(401).json({ error: 'Not authorized, no token' });
    return null;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (_e) {
    res.status(401).json({ error: 'Not authorized, token failed' });
    return null;
  }
};

const sanitizeStringArray = (value) => {
  const source = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split('\n')
      : [];
  return source
    .map((item) => String(item || '').trim())
    .filter(Boolean);
};

const normalizeSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeProductPayload = (body) => ({
  ...body,
  color: String(body?.color || '').trim(),
  features: sanitizeStringArray(body?.features),
  stylingTips: sanitizeStringArray(body?.stylingTips),
  isBestseller: Boolean(body?.isBestseller),
  isNewArrival: Boolean(body?.isNewArrival),
  latestCollectionSubcategory: String(body?.latestCollectionSubcategory || '').trim(),
});

const buildProductListQuery = ({ category, subcategory, search }) => {
  const query = {};
  const normalizedCategory = normalizeSlug(category);
  const normalizedSubcategory = normalizeSlug(subcategory);

  if (normalizedCategory === 'bestseller') {
    query.$or = [{ isBestseller: true }, { category: 'bestseller' }];
  } else if (normalizedCategory === 'new-arrival') {
    query.$or = [{ isNewArrival: true }, { category: 'new-arrival' }];
  } else if (normalizedCategory === 'latest-collection') {
    if (normalizedSubcategory) {
      query.$or = [
        { category: 'latest-collection', subcategory: normalizedSubcategory },
        { latestCollectionSubcategory: normalizedSubcategory },
      ];
    } else {
      query.$or = [
        { category: 'latest-collection' },
        { latestCollectionSubcategory: { $exists: true, $nin: ['', null] } },
      ];
    }
  } else if (category) {
    query.category = category;
    if (subcategory) {
      query.subcategory = subcategory;
    }
  } else if (subcategory) {
    query.subcategory = subcategory;
  }

  if (search) {
    const searchClause = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ],
    };
    if (query.$or) {
      return { $and: [query, searchClause] };
    }
    Object.assign(query, searchClause);
  }

  return query;
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    const query = buildProductListQuery({ category, subcategory, search });
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('userReviews.user', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user can review a product (must have purchased)
router.get('/:id/can-review', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const productId = req.params.id;
    const hasPurchased = await Order.exists({
      user: userId,
      'items.product': productId,
    });

    return res.json({ canReview: Boolean(hasPurchased) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add review to product (only purchased users)
router.post('/:id/reviews', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const { stars, review, image } = req.body;
    const normalizedStars = Number(stars);
    const normalizedReview = String(review || '').trim();
    const normalizedImage = String(image || '').trim();

    if (!normalizedReview) {
      return res.status(400).json({ error: 'Review is required' });
    }
    if (!Number.isFinite(normalizedStars) || normalizedStars < 1 || normalizedStars > 5) {
      return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    const productId = req.params.id;
    const hasPurchased = await Order.exists({
      user: userId,
      'items.product': productId,
    });
    if (!hasPurchased) {
      return res.status(403).json({ error: 'Only purchased users can add a review' });
    }

    const user = await User.findById(userId).select('_id name');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // If same user already reviewed, update their review instead of duplicating
    const existingReview = product.userReviews.find((r) => String(r.user) === String(userId));
    if (existingReview) {
      existingReview.stars = normalizedStars;
      existingReview.review = normalizedReview;
      existingReview.image = normalizedImage;
    } else {
      product.userReviews.unshift({
        user: userId,
        stars: normalizedStars,
        review: normalizedReview,
        image: normalizedImage,
      });
    }

    await product.save();
    await product.populate('userReviews.user', 'name');

    return res.status(201).json({
      message: 'Review saved successfully',
      userReviews: product.userReviews,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: remove a specific review from a product
router.delete('/:id/reviews/:reviewId', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const requester = await User.findById(userId).select('role');
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id: productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const beforeCount = product.userReviews.length;
    product.userReviews = product.userReviews.filter((rev) => String(rev._id) !== String(reviewId));
    if (product.userReviews.length === beforeCount) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await product.save();
    await product.populate('userReviews.user', 'name');

    return res.json({
      message: 'Review removed successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(normalizeProductPayload(req.body));
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      normalizeProductPayload(req.body),
      { returnDocument: 'after', runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
