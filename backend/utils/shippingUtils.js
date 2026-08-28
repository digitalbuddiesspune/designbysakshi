import StoreSettings from '../models/StoreSettings.js';

const DEFAULTS = {
  defaultShippingCharge: 50,
  freeShippingThreshold: 0,
  shippingNonRefundable: true,
};

export const getShippingSettings = async () => {
  let settings = await StoreSettings.findOne({ key: 'shipping' });
  if (!settings) {
    settings = await StoreSettings.create({ key: 'shipping', ...DEFAULTS });
  }
  return settings;
};

export const computeShippingCharge = (subtotal, settings) => {
  const charge = Math.max(0, Number(settings?.defaultShippingCharge ?? DEFAULTS.defaultShippingCharge));
  const threshold = Math.max(0, Number(settings?.freeShippingThreshold ?? DEFAULTS.freeShippingThreshold));
  if (threshold > 0 && Number(subtotal) > threshold) {
    return 0;
  }
  return charge;
};

export const computeOrderTotals = ({ items, discountAmount = 0, shippingCharge }) => {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + Number(item.price || item.priceAtOrderTime || 0) * Number(item.quantity || 0),
    0,
  );
  const discount = Math.max(0, Number(discountAmount) || 0);
  const shipping = Math.max(0, Number(shippingCharge) || 0);
  const totalAmount = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discountAmount: discount, shippingCharge: shipping, totalAmount };
};

export const computeRefundableAmount = (order) => {
  const subtotal = Number(order?.subtotal);
  const discount = Math.max(0, Number(order?.discountAmount || 0));
  if (Number.isFinite(subtotal)) {
    return Math.max(0, subtotal - discount);
  }
  const itemsSubtotal = (order?.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.priceAtOrderTime || 0),
    0,
  );
  return Math.max(0, itemsSubtotal - discount);
};
