import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subcategories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  }],
  image: {
    type: String,
    trim: true
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  priority: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
