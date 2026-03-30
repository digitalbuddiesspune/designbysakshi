import express from 'express';
import CollectionShowcase from '../models/CollectionShowcase.js';
import Category from '../models/Category.js';

const router = express.Router();

// Public: list active collection showcase items sorted by priority
router.get('/', async (req, res) => {
  try {
    const includeInactive = String(req.query.includeInactive || 'false') === 'true';
    const match = includeInactive ? {} : { active: true };
    const items = await CollectionShowcase.find(match).sort({ priority: -1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Allowed routes helper
router.get('/allowed-routes', async (_req, res) => {
  try {
    // Build from Latest Collection subcategories, fall back to empty list
    const latest = await Category.findOne({ slug: 'latest-collection' });
    const subs = Array.isArray(latest?.subcategories) ? latest.subcategories : [];
    const options = subs
      .map((s) => {
        const slug = String(s?.slug || "").trim();
        const name = String(s?.name || "").trim();
        if (!slug) return null;
        return {
          route: `/latest-collection/${slug}`,
          slug,
          name,
        };
      })
      .filter(Boolean);
    res.json(options);
  } catch {
    res.json([]);
  }
});

// CRUD
router.post('/', async (req, res) => {
  try {
    // Validate route and uniqueness per route
    const route = req.body.route;
    if (!/^\/latest-collection\/[a-z0-9-]+$/i.test(route || '')) {
      return res.status(400).json({ error: 'Route must be /latest-collection/<slug>.' });
    }
    const existingForRoute = await CollectionShowcase.findOne({ route });
    if (existingForRoute) {
      return res.status(400).json({ error: 'This route is already configured. Edit it instead.' });
    }
    const created = await CollectionShowcase.create(req.body);

    // Sync into Latest Collection category subcategories
    try {
      const latest = await Category.findOne({ slug: 'latest-collection' });
      if (latest) {
        const slug = String(route.split('/').pop());
        const name = req.body.title || slug.replace(/-/g, ' ');
        const exists = (latest.subcategories || []).some((s) => s.slug === slug);
        if (!exists) {
          latest.subcategories.push({ name, slug });
          await latest.save();
        }
      }
    } catch (_e) {}
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // If changing route, validate and enforce uniqueness
    if (req.body.route) {
      if (!/^\/latest-collection\/[a-z0-9-]+$/i.test(req.body.route || '')) {
        return res.status(400).json({ error: 'Route must be /latest-collection/<slug>.' });
      }
      const dup = await CollectionShowcase.findOne({ route: req.body.route, _id: { $ne: req.params.id } });
      if (dup) {
        return res.status(400).json({ error: 'This route is already configured.' });
      }
    }
    const updated = await CollectionShowcase.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    // If title or route changed, reflect in Latest Collection subcategories
    try {
      const latest = await Category.findOne({ slug: 'latest-collection' });
      if (latest) {
        const newSlug = String((req.body.route || updated.route || '').split('/').pop());
        const oldSlug = String((updated.route || '').split('/').pop());
        const title = req.body.title || updated.title || newSlug.replace(/-/g, ' ');
        let changed = false;
        for (const sub of latest.subcategories || []) {
          if (sub.slug === oldSlug) {
            sub.slug = newSlug;
            sub.name = title;
            changed = true;
            break;
          }
        }
        if (!changed && newSlug) {
          latest.subcategories.push({ name: title, slug: newSlug });
        }
        await latest.save();
      }
    } catch (_e) {}
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CollectionShowcase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    // Remove from Latest Collection subcategories
    try {
      const latest = await Category.findOne({ slug: 'latest-collection' });
      if (latest) {
        const slug = String((deleted.route || '').split('/').pop());
        latest.subcategories = (latest.subcategories || []).filter((s) => s.slug !== slug);
        await latest.save();
      }
    } catch (_e) {}
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

