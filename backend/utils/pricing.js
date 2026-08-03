/**
 * Parse discount percentage from values like "10", "10%", "10% OFF".
 */
export function parseDiscountPercent(discountType) {
  if (discountType == null || discountType === '') return 0;
  if (typeof discountType === 'number') {
    return Number.isFinite(discountType) ? Math.min(100, Math.max(0, discountType)) : 0;
  }
  const match = String(discountType).match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function getDiscountedPrice(price, discountType) {
  const base = Number(price);
  if (!Number.isFinite(base) || base < 0) return 0;
  const percent = parseDiscountPercent(discountType);
  if (!percent) return Math.round(base);
  return Math.max(0, Math.round(base * (1 - percent / 100)));
}
