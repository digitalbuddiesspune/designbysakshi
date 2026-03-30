import mongoose from 'mongoose';

const CollectionShowcaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' }, // optional thumbnail shown in Shop By Collection
    mobileImage: { type: String, default: '' },
    // Allow any /latest-collection/<slug> form
    route: {
      type: String,
      required: true,
      match: /^\/latest-collection\/[a-z0-9-]+$/i,
    },
    heroDesktop: { type: String, default: '' }, // optional page hero (desktop)
    heroMobile: { type: String, default: '' }, // optional page hero (mobile)
    priority: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('CollectionShowcase', CollectionShowcaseSchema);

