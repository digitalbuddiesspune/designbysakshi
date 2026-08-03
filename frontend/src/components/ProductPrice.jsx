import React from "react";
import { formatInr, getDiscountedPrice, parseDiscountPercent } from "../utils/pricing.js";

const ProductPrice = ({
  price,
  discountType,
  className = "",
  priceClassName = "font-bold text-gray-900",
  originalClassName = "text-sm text-gray-400 line-through",
  badgeClassName = "text-xs font-semibold text-green-600",
  showBadge = true,
  size = "md",
}) => {
  const original = Number(price) || 0;
  const percent = parseDiscountPercent(discountType);
  const discounted = getDiscountedPrice(original, discountType);
  const hasDiscount = percent > 0 && discounted < original;

  const priceSize =
    size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";

  if (!hasDiscount) {
    return (
      <span className={`${priceSize} ${priceClassName} ${className}`.trim()}>
        {formatInr(original)}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <span className={`${priceSize} ${priceClassName}`}>{formatInr(discounted)}</span>
      <span className={originalClassName}>{formatInr(original)}</span>
      {showBadge ? <span className={badgeClassName}>{percent}% OFF</span> : null}
    </span>
  );
};

export default ProductPrice;
