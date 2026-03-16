import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    guestId: {
      type: String,
      index: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// NOTE: Avoid using next() style middleware here because it can break depending on mongoose version.
// Owner validation is handled in the routes (userId/guestId required).

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

