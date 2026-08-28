import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'shipping',
    },
    defaultShippingCharge: {
      type: Number,
      min: 0,
      default: 50,
    },
    freeShippingThreshold: {
      type: Number,
      min: 0,
      default: 0,
    },
    shippingNonRefundable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('StoreSettings', storeSettingsSchema);
