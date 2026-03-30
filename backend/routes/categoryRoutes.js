import express from 'express';
import Category from '../models/Category.js';
import CollectionShowcase from '../models/CollectionShowcase.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    // Sort by priority (lower number = higher priority, comes first), then by name
    const categories = await Category.find().sort({ priority: 1, name: 1 });
    // Sort subcategories by priority (asc) then name for each category
    const sorted = categories.map((cat) => {
      const sub = Array.isArray(cat.subcategories) ? [...cat.subcategories] : [];
      sub.sort((a, b) => {
        const ap = Number.isFinite(a.priority) ? a.priority : 0;
        const bp = Number.isFinite(b.priority) ? b.priority : 0;
        if (ap !== bp) return ap - bp;
        return String(a.name || '').localeCompare(String(b.name || ''));
      });
      return { ...cat.toObject(), subcategories: sub };
    });
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    // Use find → mutate → save to reliably persist nested subdocument fields like image/priority
    const doc = await Category.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Assign top-level fields
    if (typeof req.body.name !== 'undefined') doc.name = req.body.name;
    if (typeof req.body.slug !== 'undefined') doc.slug = req.body.slug;
    if (typeof req.body.image !== 'undefined') doc.image = req.body.image;
    if (typeof req.body.discountedPrice !== 'undefined') doc.discountedPrice = req.body.discountedPrice;
    if (typeof req.body.priority !== 'undefined') doc.priority = req.body.priority;
    if (typeof req.body.description !== 'undefined') doc.description = req.body.description;

    // Replace subcategories if provided (includes optional image/priority per sub)
    if (Array.isArray(req.body.subcategories)) {
      doc.subcategories = req.body.subcategories.map((s) => ({
        name: s.name,
        slug: s.slug,
        image: s.image || '',
        priority: Number.isFinite(s.priority) ? s.priority : 0,
      }));
      doc.markModified('subcategories');
    }

    const category = await doc.save();

    // If updating Latest Collection, sync with collection showcase as the homepage source of truth
    if ((category.slug || '').toLowerCase() === 'latest-collection') {
      const subs = Array.isArray(category.subcategories) ? category.subcategories : [];
      // Prepare desired showcase set from subs
      const desired = subs.map((s) => {
        const slug = s.slug;
        const route = `/latest-collection/${slug}`;
        const title = s.name;
        const image = s.image || '';
        const priority = Number.isFinite(s.priority) ? s.priority : 0;
        return { route, title, image, priority, active: true };
      });

      // Existing showcases for latest-collection routes
      const existing = await CollectionShowcase.find({
        route: { $regex: /^\/latest-collection\/[a-z0-9-]+$/i },
      });

      // Upsert desired entries
      for (const d of desired) {
        const doc = existing.find((e) => e.route === d.route);
        if (doc) {
          doc.title = d.title;
          if (d.image) doc.image = d.image;
          doc.priority = d.priority;
          doc.active = true;
          await doc.save();
        } else {
          await CollectionShowcase.create({
            title: d.title,
            image: d.image,
            route: d.route,
            priority: d.priority,
            active: true,
          });
        }
      }

      // Remove showcases that are no longer desired and belong to latest-collection
      const desiredRoutes = new Set(desired.map((d) => d.route));
      for (const e of existing) {
        if (e.route.startsWith('/latest-collection/') && !desiredRoutes.has(e.route)) {
          await CollectionShowcase.deleteOne({ _id: e._id });
        }
      }
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
