import express from 'express';
import Banner from '../models/Banner.js';

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

// Admin-like CRUD (no auth middleware in project yet)
router.post('/', async (req, res) => {
  try {
    const created = await Banner.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

