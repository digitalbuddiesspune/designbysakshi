import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Coupon from '../models/Coupon.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();
const normalizeStatus = (status) => {
  if (status === 'pending') return 'confirm';
  if (status === 'returnable') return 'refundable';
  return status;
};
const ADMIN_STATUS_FLOW = new Set(['confirm', 'processing', 'shipped', 'delivered', 'refundable', 'cancelled', 'pending']);
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY || '';

const verifyToken = (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return null;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (e) {
    res.status(401).json({ message: 'Not authorized, token failed' });
    return null;
  }
};

const getRazorpayInstance = () => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

router.get('/payment/razorpay/key', (req, res) => {
  if (!RAZORPAY_KEY_ID) {
    return res.status(500).json({ message: 'Razorpay key is not configured' });
  }
  return res.json({ key: RAZORPAY_KEY_ID });
});

router.post('/payment/razorpay/create-order', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const amount = Number(req.body?.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ message: 'Razorpay is not configured on server' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${userId.slice(-6)}`,
      payment_capture: 1,
    });

    return res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
});

router.post('/payment/razorpay/verify', (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing Razorpay verification fields' });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay secret is not configured' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    return res.json({ verified: true });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return res.status(500).json({ message: 'Failed to verify Razorpay payment' });
  }
});

// @desc    Store payment attempt (success/unpaid/failed)
// @route   POST /api/orders/payment/attempt
// @access  Private
router.post('/payment/attempt', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const {
      items = [],
      totalAmount = 0,
      paymentStatus = 'failed',
      paymentMethod = 'online',
      transactionId = '',
      errorMessage = '',
      orderId = null,
    } = req.body || {};

    if (!['paid', 'unpaid', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid paymentStatus' });
    }
    if (!['online', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid paymentMethod' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const normalizedItems = Array.isArray(items)
      ? items.map((i) => ({
          product: i?.product || null,
          quantity: Number(i?.quantity || 1),
          name: i?.name || '',
        }))
      : [];

    const payment = await Payment.create({
      user: userId,
      email: user.email || '',
      order: orderId || null,
      items: normalizedItems,
      totalAmount: Number(totalAmount || 0),
      paymentStatus,
      paymentMethod,
      transactionId: transactionId || '',
      errorMessage: errorMessage || '',
    });

    return res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment attempt error:', error);
    return res.status(500).json({ message: 'Failed to store payment attempt' });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const { items, shippingAddress, paymentMethod, totalAmount, transactionId = '', couponCode = '', discountAmount = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const nameParts = (shippingAddress.fullName || '').split(' ');
    const createdAddress = await Address.create({
      fullName: shippingAddress.fullName || user.name || '',
      email: user.email || '',
      firstName: nameParts[0] || 'Unknown',
      lastName: nameParts.slice(1).join(' ') || '',
      phone: shippingAddress.phone || '',
      street: shippingAddress.street || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      pincode: shippingAddress.pincode || '',
      landmark: shippingAddress.landmark || '',
      user: userId,
    });

    const order = await Order.create({
      user: userId,
      name: user.name,
      email: user.email,
      phone: user.phone || shippingAddress.phone || '',
      address: createdAddress._id,
      items: items.map(i => ({
        product: i.product,
        quantity: i.quantity,
        priceAtOrderTime: i.price,
      })),
      paymentMode: paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'unpaid',
      transactionId: paymentMethod === 'online' ? transactionId : '',
      couponCode: couponCode || '',
      discountAmount: Number(discountAmount || 0),
      status: 'confirm',
      statusHistory: [{ status: 'confirm', changedAt: new Date() }],
      totalAmount,
    });

    await Payment.create({
      user: userId,
      email: user.email || '',
      order: order._id,
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
      })),
      totalAmount,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'unpaid',
      paymentMethod,
      transactionId: paymentMethod === 'online' ? transactionId : '',
    });

    if (couponCode) {
      await Coupon.updateOne({ code: String(couponCode).trim().toUpperCase() }, { $inc: { usedCount: 1 } });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .populate('address')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
// @access  Public (admin UI only)
router.get('/admin', async (req, res) => {
  try {
    const { startDate, endDate, orderStatus, paymentStatus } = req.query;

    const filter = {};
    if (orderStatus) {
      const normalized = normalizeStatus(orderStatus);
      if (normalized === 'confirm') {
        // include older records stored as `pending`
        filter.status = { $in: ['confirm', 'pending'] };
      } else {
        filter.status = normalized;
      }
    }
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const d = new Date(endDate);
        // include end date full day
        d.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = d;
      }
    }

    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('address')
      .populate('user')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get payments list (admin)
// @route   GET /api/orders/admin/payments
// @access  Public (admin UI only)
router.get('/admin/payments', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      paymentStatus = 'all',
      paymentMethod = 'all',
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const createdAtFilter = {};
    if (startDate) createdAtFilter.$gte = new Date(startDate);
    if (endDate) {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      createdAtFilter.$lte = d;
    }

    const paymentFilter = {};
    if (paymentStatus !== 'all') paymentFilter.paymentStatus = paymentStatus;
    if (paymentMethod !== 'all') paymentFilter.paymentMethod = paymentMethod;
    if (Object.keys(createdAtFilter).length) paymentFilter.createdAt = createdAtFilter;

    const dbPayments = await Payment.find(paymentFilter)
      .populate('user', 'email')
      .populate('items.product', 'name')
      .populate('order', 'orderNumber');

    // Backfill view: include old orders that were created before Payment model existed.
    const orderFilter = {};
    if (paymentStatus !== 'all') orderFilter.paymentStatus = paymentStatus;
    if (paymentMethod !== 'all') orderFilter.paymentMode = paymentMethod;
    if (Object.keys(createdAtFilter).length) orderFilter.createdAt = createdAtFilter;

    const orderIdsAlreadyPresent = new Set(
      dbPayments
        .map((p) => (p?.order?._id || p?.order || null))
        .filter(Boolean)
        .map((id) => String(id))
    );

    const legacyOrders = await Order.find(orderFilter)
      .populate('user', 'email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    const mappedLegacyPayments = legacyOrders
      .filter((o) => !orderIdsAlreadyPresent.has(String(o._id)))
      .map((o) => ({
        _id: `legacy_${o._id}`,
        user: o.user,
        email: o.email || o.user?.email || '',
        order: { _id: o._id, orderNumber: o.orderNumber },
        items: (o.items || []).map((it) => ({
          product: it.product,
          quantity: it.quantity,
          name: it.product?.name || '',
        })),
        totalAmount: o.totalAmount || 0,
        paymentStatus: o.paymentStatus || 'unpaid',
        paymentMethod: o.paymentMode || 'cash',
        transactionId: o.paymentMode === 'online' ? (o.transactionId || '') : '',
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      }));

    const merged = [...dbPayments.map((d) => d.toObject()), ...mappedLegacyPayments];
    const dir = sortOrder === 'asc' ? 1 : -1;
    merged.sort((a, b) => {
      if (sortBy === 'paymentStatus') {
        const cmp = String(a.paymentStatus || '').localeCompare(String(b.paymentStatus || ''));
        if (cmp !== 0) return cmp * dir;
      } else if (sortBy === 'paymentMethod') {
        const cmp = String(a.paymentMethod || '').localeCompare(String(b.paymentMethod || ''));
        if (cmp !== 0) return cmp * dir;
      }
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return (da - db) * dir;
    });

    return res.json(merged);
  } catch (error) {
    console.error('Get admin payments error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get order details (admin)
// @route   GET /api/orders/admin/:id
// @access  Public (admin UI only)
router.get('/admin/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('address')
      .populate('user');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) {
    console.error('Get admin order details error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Public (admin UI only)
router.put('/admin/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });
    const nextStatus = normalizeStatus(status);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const prevStatus = normalizeStatus(order.status);
    const deliveredPreviously =
      prevStatus === 'delivered' ||
      (Array.isArray(order.statusHistory) ? order.statusHistory : []).some((h) => normalizeStatus(h?.status) === 'delivered');

    order.status = nextStatus;
    if (prevStatus !== nextStatus) {
      order.statusHistory = [...(order.statusHistory || []), { status: nextStatus, changedAt: new Date() }];
    }
    if (nextStatus === 'cancelled' && order.paymentStatus === 'paid') {
      // keep as-is for now; you can change if you have refund logic later
    }
    // Auto rule: once delivered (or marked refundable), set paymentStatus to paid.
    if ((nextStatus === 'delivered' || nextStatus === 'refundable') && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
    }

    // Stock decrement rule: decrement product stock only once, when transitioning into `delivered`.
    // (Returnable does not decrement stock.)
    if (prevStatus !== nextStatus && nextStatus === 'delivered' && !deliveredPreviously) {
      for (const item of order.items || []) {
        const qty = Number(item?.quantity || 0);
        if (!qty) continue;
        const productId = item?.product;
        if (!productId) continue;

        const product = await Product.findById(productId);
        if (!product) continue;

        const currentStock = Number(product.stock || 0);
        const nextStock = Math.max(currentStock - qty, 0);
        product.stock = nextStock;
        product.inStock = nextStock > 0;
        await product.save();
      }
    }

    const updated = await order.save();
    return res.json(updated);
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update payment status (admin)
// @route   PUT /api/orders/admin/:id/payment-status
// @access  Public (admin UI only)
router.put('/admin/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) return res.status(400).json({ message: 'paymentStatus is required' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = paymentStatus;
    const updated = await order.save();
    return res.json(updated);
  } catch (error) {
    console.error('Update payment status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get order details for logged-in user
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const order = await Order.findOne({ _id: req.params.id, user: userId })
      .populate('items.product')
      .populate('address')
      .sort({ createdAt: -1 });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) {
    console.error('Get order details error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Cancel an order
// @route   POST /api/orders/:id/cancel
// @access  Private
router.post('/:id/cancel', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const order = await Order.findOne({ _id: req.params.id, user: userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const currentStatus = normalizeStatus(order.status);
    if (['processing', 'shipped', 'delivered', 'refundable', 'cancelled'].includes(currentStatus)) {
      return res.status(400).json({ message: `Cannot cancel an order that is ${order.status}` });
    }

    order.status = 'cancelled';
    order.statusHistory = [...(order.statusHistory || []), { status: 'cancelled', changedAt: new Date() }];
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
