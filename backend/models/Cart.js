import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variantId: {
      type: String,
      trim: true,
      default: '',
    },
    variantColor: {
      type: String,
      trim: true,
      default: '',
    },
    variantSize: {
      type: String,
      trim: true,
      default: '',
    },
    variantImage: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceAtAddTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    guestId: {
      // For non-logged-in users (e.g. IP or browser-generated id)
      type: String,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
