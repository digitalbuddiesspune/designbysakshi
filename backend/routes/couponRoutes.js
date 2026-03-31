import express from 'express';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';

const router = express.Router();

const normalizeCode = (v) => String(v || '').trim().toUpperCase();

router.get('/', async (_req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch coupons' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const code = normalizeCode(payload.code);
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
      code,
      discountType: payload.discountType || 'percent',
      discountValue: Number(payload.discountValue || 0),
      minOrderAmount: Number(payload.minOrderAmount || 0),
      // As per business rule: coupon applies on all products only.
      maxDiscountAmount: 0,
      appliesTo: 'all',
      categorySlugs: [],
      productIds: [],
      productRules: [],
      usageLimit: Number(payload.usageLimit || 0),
      isActive: payload.isActive !== false,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
    });

    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create coupon' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payload = req.body || {};
    if (payload.code) payload.code = normalizeCode(payload.code);
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json(coupon);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update coupon' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Coupon not found' });
    return res.json({ message: 'Coupon deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const code = normalizeCode(req.body?.code);
    const subtotal = Number(req.body?.subtotal || 0);
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    if (!code) return res.status(400).json({ message: 'Coupon code is required' });
    if (!subtotal || subtotal <= 0) return res.status(400).json({ message: 'Invalid subtotal' });

    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is inactive' });
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (subtotal < Number(coupon.minOrderAmount || 0)) {
      return res.status(400).json({ message: `Minimum order amount is ₹${Number(coupon.minOrderAmount || 0)}` });
    }

    // Coupon applies to whole cart.
    const eligibleSubtotal = subtotal;
    if (eligibleSubtotal < Number(coupon.minOrderAmount || 0)) {
      return res.status(400).json({ message: `Minimum order amount is ₹${Number(coupon.minOrderAmount || 0)}` });
    }

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = (eligibleSubtotal * Number(coupon.discountValue || 0)) / 100;
    } else {
      discount = Number(coupon.discountValue || 0);
      discount = Math.min(discount, eligibleSubtotal);
    }

    discount = Math.max(0, Math.min(discount, eligibleSubtotal));
    const finalAmount = Math.max(0, subtotal - discount);

    return res.json({
      valid: true,
      code: coupon.code,
      discountAmount: Math.round(discount),
      finalAmount: Math.round(finalAmount),
      couponId: coupon._id,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to validate coupon' });
  }
});

export default router;
