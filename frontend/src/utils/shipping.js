export const DEFAULT_SHIPPING_SETTINGS = {
  defaultShippingCharge: 50,
  freeShippingThreshold: 0,
  shippingNonRefundable: true,
};

export const computeShippingFee = (subtotal, settings = DEFAULT_SHIPPING_SETTINGS) => {
  const charge = Math.max(0, Number(settings.defaultShippingCharge ?? 50));
  const threshold = Math.max(0, Number(settings.freeShippingThreshold ?? 0));
  if (threshold > 0 && Number(subtotal) > threshold) {
    return 0;
  }
  return charge;
};

export const getOrderShippingCharge = (order) => {
  if (order && Number.isFinite(Number(order.shippingCharge))) {
    return Math.max(0, Number(order.shippingCharge));
  }
  const subtotal = (order?.items || []).reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.priceAtOrderTime || 0),
    0,
  );
  const couponDiscount = Math.max(0, Number(order?.discountAmount || 0));
  return Math.max(0, Number(order?.totalAmount || 0) - subtotal + couponDiscount);
};

export const getOrderRefundAmount = (order) => {
  if (order && Number.isFinite(Number(order.refundAmount)) && Number(order.refundAmount) > 0) {
    return Number(order.refundAmount);
  }
  const subtotal = Number.isFinite(Number(order?.subtotal))
    ? Number(order.subtotal)
    : (order?.items || []).reduce(
        (sum, it) => sum + Number(it.quantity || 0) * Number(it.priceAtOrderTime || 0),
        0,
      );
  const discount = Math.max(0, Number(order?.discountAmount || 0));
  return Math.max(0, subtotal - discount);
};
