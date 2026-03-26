import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

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
  } catch (e) {
    res.status(401).json({ error: 'Not authorized, token failed' });
    return null;
  }
};

// Auth check route used by frontend to auto-logout deleted users
router.get('/auth-check', async (req, res) => {
  try {
    const userId = verifyToken(req, res);
    if (!userId) return;
    const user = await User.findById(userId).select('_id role');
    if (!user) return res.status(401).json({ error: 'User no longer exists' });
    return res.json({ ok: true, userId: user._id, role: user.role });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: list all users with address + order stats
router.get('/admin', async (_req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);

    const [addresses, orderStats] = await Promise.all([
      Address.find({ user: { $in: userIds } }).sort({ createdAt: -1 }),
      Order.aggregate([
        { $match: { user: { $in: userIds } } },
        {
          $project: {
            user: 1,
            orderCount: { $literal: 1 },
            qty: { $sum: '$items.quantity' },
          },
        },
        {
          $group: {
            _id: '$user',
            totalOrders: { $sum: '$orderCount' },
            totalQuantityPurchased: { $sum: '$qty' },
          },
        },
      ]),
    ]);

    const latestAddressByUser = new Map();
    addresses.forEach((a) => {
      const key = String(a.user || '');
      if (!key || latestAddressByUser.has(key)) return;
      latestAddressByUser.set(key, a);
    });

    const statsByUser = new Map(orderStats.map((s) => [String(s._id), s]));

    const response = users.map((u) => {
      const key = String(u._id);
      const stat = statsByUser.get(key);
      const adr = latestAddressByUser.get(key);
      return {
        _id: u._id,
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        address: adr
          ? `${adr.street}, ${adr.city}, ${adr.state} - ${adr.pincode}`
          : 'No address',
        totalOrders: stat?.totalOrders || 0,
        totalQuantityPurchased: stat?.totalQuantityPurchased || 0,
      };
    });

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: delete user and all related data
router.delete('/admin/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Admin user cannot be deleted' });
    }

    await Promise.all([
      User.deleteOne({ _id: userId }),
      Address.deleteMany({ user: userId }),
      Order.deleteMany({ user: userId }),
      Cart.deleteMany({ user: userId }),
      Wishlist.deleteMany({ user: userId }),
    ]);

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone || undefined;

    await user.save();

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
