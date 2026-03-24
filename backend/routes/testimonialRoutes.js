import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// GET all active testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET all testimonials (for admin)
router.get('/admin', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST new testimonial (admin)
router.post('/', async (req, res) => {
  try {
    const { name, review, rating, isActive } = req.body;
    const testimonial = new Testimonial({ name, review, rating, isActive });
    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add testimonial' });
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update testimonial (toggle active)
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      testimonial.name = req.body.name !== undefined ? req.body.name : testimonial.name;
      testimonial.review = req.body.review !== undefined ? req.body.review : testimonial.review;
      testimonial.rating = req.body.rating !== undefined ? req.body.rating : testimonial.rating;
      testimonial.isActive = req.body.isActive !== undefined ? req.body.isActive : testimonial.isActive;
      
      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
