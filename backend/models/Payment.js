import mongoose from 'mongoose';

const paymentItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    items: {
      type: [paymentItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'failed'],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash'],
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
      default: '',
    },
    errorMessage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
