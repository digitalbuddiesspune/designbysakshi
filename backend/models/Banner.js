import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    imageDesktop: { type: String, required: true },
    imageMobile: { type: String, default: '' },
    link: { type: String, default: '' },
    priority: { type: Number, default: 0 }, // higher shows first
    active: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', BannerSchema);

