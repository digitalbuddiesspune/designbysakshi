import mongoose from 'mongoose';
import { JEWELLERY_CARE } from '../constants/jewelleryCare.js';

const userReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const careInstructionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      trim: true,
      default: '',
    },
    size: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional gallery images. First image should still be stored in `image`.
    images: {
      type: [String],
      required: false,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountType: {
      type: String,
      trim: true,
    },
    hsnCode: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    color: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    features: {
      type: [String],
      required: false,
      default: [],
    },
    stylingTips: {
      type: [String],
      required: false,
      default: [],
    },
    careTitle: {
      type: String,
      trim: true,
      default: JEWELLERY_CARE.title,
    },
    careDescription: {
      type: String,
      trim: true,
      default: JEWELLERY_CARE.description,
    },
    careInstructions: {
      type: [careInstructionSchema],
      default: () => JEWELLERY_CARE.careInstructions,
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    // When set, product also appears under latest-collection / this subcategory
    latestCollectionSubcategory: {
      type: String,
      trim: true,
      default: '',
    },
    userReviews: {
      type: [userReviewSchema],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre('validate', function applyCareDefaults() {
  if (!this.careTitle) this.careTitle = JEWELLERY_CARE.title;
  if (!this.careDescription) this.careDescription = JEWELLERY_CARE.description;
  if (!Array.isArray(this.careInstructions) || this.careInstructions.length === 0) {
    this.careInstructions = JEWELLERY_CARE.careInstructions;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
