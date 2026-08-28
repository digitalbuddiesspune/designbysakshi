import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getShippingSettings } from '../utils/shippingUtils.js';

const router = express.Router();

router.get('/shipping', async (_req, res) => {
  try {
    const settings = await getShippingSettings();
    res.json({
      defaultShippingCharge: settings.defaultShippingCharge,
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingNonRefundable: settings.shippingNonRefundable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/shipping', protect, adminOnly, async (req, res) => {
  try {
    const settings = await getShippingSettings();
    if (req.body.defaultShippingCharge !== undefined) {
      settings.defaultShippingCharge = Math.max(0, Number(req.body.defaultShippingCharge) || 0);
    }
    if (req.body.freeShippingThreshold !== undefined) {
      settings.freeShippingThreshold = Math.max(0, Number(req.body.freeShippingThreshold) || 0);
    }
    if (req.body.shippingNonRefundable !== undefined) {
      settings.shippingNonRefundable = Boolean(req.body.shippingNonRefundable);
    }
    await settings.save();
    res.json({
      defaultShippingCharge: settings.defaultShippingCharge,
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingNonRefundable: settings.shippingNonRefundable,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
