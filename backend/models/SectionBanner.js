import mongoose from 'mongoose';

export const SECTION_BANNER_KEYS = [
  'shop-by-category',
  'new-arrival',
  'bestseller',
  'shop-by-collection',
];

const sectionBannerSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: SECTION_BANNER_KEYS,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    imageDesktop: {
      type: String,
      trim: true,
      default: '',
    },
    imageMobile: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('SectionBanner', sectionBannerSchema);
