import express from 'express';
import Banner from '../models/Banner.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: list active banners (optionally include inactive with query)
router.get('/', async (req, res) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const now = new Date();
    const match = includeInactive
      ? {}
      : {
          active: true,
          $and: [
            { $or: [{ startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
            { $or: [{ endsAt: { $exists: false } }, { endsAt: { $gte: now } }] }
          ]
        };
    const banners = await Banner.find(match).sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin CRUD protected by auth middleware
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const created = await Banner.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

