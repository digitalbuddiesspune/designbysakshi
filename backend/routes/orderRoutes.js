import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import User from '../models/User.js';

const router = express.Router();

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

// @desc    Cancel an order
// @route   POST /api/orders/:id/cancel
// @access  Private
router.post('/:id/cancel', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;

    const order = await Order.findOne({ _id: req.params.id, user: userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
