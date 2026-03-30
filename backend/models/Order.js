import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtOrderTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['confirm', 'processing', 'shipped', 'delivered', 'refundable', 'returnable', 'cancelled', 'pending'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    items: [orderItemSchema],
    paymentMode: {
      type: String,
      enum: ['cash', 'online'],
      required: true,
    },
    status: {
      type: String,
      enum: ['confirm', 'processing', 'shipped', 'delivered', 'refundable', 'returnable', 'cancelled', 'pending'],
      default: 'confirm',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'failed'],
      default: 'unpaid',
    },
    transactionId: {
      type: String,
      trim: true,
      default: '',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const last = await mongoose.model('Order').findOne({}, {}, { sort: { orderNumber: -1 } });
    this.orderNumber = last?.orderNumber ? last.orderNumber + 1 : 1001;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
