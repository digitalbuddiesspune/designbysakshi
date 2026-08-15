import express from 'express';
import Category from '../models/Category.js';
import CollectionShowcase from '../models/CollectionShowcase.js';
import SectionBanner, { SECTION_BANNER_KEYS } from '../models/SectionBanner.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_SECTION_BANNERS = {
  'shop-by-category': {
    title: 'Shop By Category',
    imageDesktop: '',
    imageMobile: '',
    link: '',
    active: true,
  },
  'new-arrival': {
    title: 'New Arrival',
    imageDesktop:
      'https://res.cloudinary.com/dbfooaz44/image/upload/v1773742412/3_xx5pf1.png',
    imageMobile:
      'https://res.cloudinary.com/dbfooaz44/image/upload/v1773769835/3_lvbj7z.png',
    link: '/new-arrival',
    active: true,
  },
  bestseller: {
    title: 'Bestseller',
    imageDesktop:
      'https://res.cloudinary.com/dbfooaz44/image/upload/v1778229683/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1920_x_550_px_1_ngr69h.png',
    imageMobile:
      'https://res.cloudinary.com/dbfooaz44/image/upload/v1778230160/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1080_x_500_px_luxba6.png',
    link: '/bestseller',
    active: true,
  },
  'shop-by-collection': {
    title: 'Shop By Collection',
    imageDesktop: '',
    imageMobile: '',
    link: '',
    active: true,
  },
};

const ensureSectionBanners = async () => {
  const existing = await SectionBanner.find({ key: { $in: SECTION_BANNER_KEYS } });
  const byKey = new Map(existing.map((item) => [item.key, item]));
  const results = [];

  for (const key of SECTION_BANNER_KEYS) {
    if (byKey.has(key)) {
      results.push(byKey.get(key));
      continue;
    }
    const defaults = DEFAULT_SECTION_BANNERS[key] || { title: key };
    const created = await SectionBanner.create({ key, ...defaults });
    results.push(created);
  }

  return results;
};

const normalizeBannerPayload = (body = {}) => {
  const payload = {};
  if (body.title !== undefined) payload.title = String(body.title || '').trim();
  if (body.imageDesktop !== undefined) payload.imageDesktop = String(body.imageDesktop || '').trim();
  if (body.imageMobile !== undefined) payload.imageMobile = String(body.imageMobile || '').trim();
  if (body.link !== undefined) payload.link = String(body.link || '').trim();
  if (body.active !== undefined) payload.active = Boolean(body.active);
  return payload;
};

// Public + admin: full homepage section image payload
router.get('/', async (_req, res) => {
  try {
    const banners = await ensureSectionBanners();
    const bannerMap = Object.fromEntries(banners.map((b) => [b.key, b]));

    const categories = await Category.find({
      slug: { $nin: ['latest-collection', 'bestseller', 'new-arrival'] },
    }).sort({ priority: 1, name: 1 });

    const collections = await CollectionShowcase.find().sort({ priority: -1, createdAt: -1 });

    res.json({
      banners: bannerMap,
      shopByCategory: categories,
      shopByCollection: collections,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: get one section banner by key
router.get('/banners/:key', async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!SECTION_BANNER_KEYS.includes(key)) {
      return res.status(400).json({ error: 'Invalid section key' });
    }
    await ensureSectionBanners();
    const banner = await SectionBanner.findOne({ key });
    if (!banner) return res.status(404).json({ error: 'Section banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: update section banner (upsert)
router.put('/banners/:key', protect, adminOnly, async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!SECTION_BANNER_KEYS.includes(key)) {
      return res.status(400).json({ error: 'Invalid section key' });
    }
    await ensureSectionBanners();
    const payload = normalizeBannerPayload(req.body);
    const updated = await SectionBanner.findOneAndUpdate(
      { key },
      { $set: payload },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Section banner not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: update Shop By Category item image
router.put('/shop-by-category/:id', protect, adminOnly, async (req, res) => {
  try {
    const image = String(req.body?.image || '').trim();
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { image } },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: update Shop By Collection item image
router.put('/shop-by-collection/:id', protect, adminOnly, async (req, res) => {
  try {
    const payload = {};
    if (req.body?.image !== undefined) payload.image = String(req.body.image || '').trim();
    if (req.body?.mobileImage !== undefined) {
      payload.mobileImage = String(req.body.mobileImage || '').trim();
    }
    if (req.body?.title !== undefined) payload.title = String(req.body.title || '').trim();
    if (req.body?.active !== undefined) payload.active = Boolean(req.body.active);

    const updated = await CollectionShowcase.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Collection not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
