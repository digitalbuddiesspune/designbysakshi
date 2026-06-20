import mongoose from 'mongoose';

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
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
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
    min: 0
  },
  discountType: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    required: false,
    default: "",
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
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
  description: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
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
    default: "",
  },
  userReviews: {
    type: [userReviewSchema],
    required: false,
    default: [],
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
