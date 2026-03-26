import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import User from '../models/User.js';

const router = express.Router();
const normalizeStatus = (status) => (status === 'pending' ? 'confirm' : status);
const ADMIN_STATUS_FLOW = new Set(['confirm', 'processing', 'shipped', 'delivered', 'returnable', 'cancelled', 'pending']);

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

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const nameParts = (shippingAddress.fullName || '').split(' ');
    const createdAddress = await Address.create({
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
      status: 'confirm',
      statusHistory: [{ status: 'confirm', changedAt: new Date() }],
      totalAmount,
    });

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
    order.status = nextStatus;
    if (prevStatus !== nextStatus) {
      order.statusHistory = [...(order.statusHistory || []), { status: nextStatus, changedAt: new Date() }];
    }
    if (nextStatus === 'cancelled' && order.paymentStatus === 'paid') {
      // keep as-is for now; you can change if you have refund logic later
    }
    // Auto rule: once delivered (or marked returnable), set paymentStatus to paid.
    if ((nextStatus === 'delivered' || nextStatus === 'returnable') && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
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
    if (['processing', 'shipped', 'delivered', 'returnable', 'cancelled'].includes(currentStatus)) {
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
