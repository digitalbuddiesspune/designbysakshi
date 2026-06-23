import React from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const HomeProductCard = ({
  product,
  index = 0,
  badgeLabel,
  badgeStyle = { background: "#116766" },
  onAddToCart,
  onAddToWishlist,
}) => (
  <div
    className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    style={{
      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
    }}
  >
    <div
      className="absolute left-0 top-2 z-10 px-3 py-1 text-xs font-semibold text-white"
      style={badgeStyle}
    >
      {badgeLabel}
    </div>

    <Link to={`/product/${product._id}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300"
          onMouseEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "var(--brand-lavender-soft)";
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "white";
          }}
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist?.(product._id);
          }}
          aria-label="Add to wishlist"
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </Link>

    <div className="p-3">
      <div className="mb-1 flex items-center gap-1">
        <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-xs font-semibold text-gray-800">{product.rating || "4.8"}</span>
      </div>

      <h3
        className="mb-1 line-clamp-1 text-sm font-semibold text-gray-900"
        style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
      >
        {product.name}
      </h3>

      <div className="mb-2 flex items-center gap-2">
        <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
        <span className="text-xs text-gray-500 line-through">
          {formatPrice(product.originalPrice || product.price * 1.2)}
        </span>
      </div>

      <button
        type="button"
        className="w-full rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 active:scale-95 sm:text-sm sm:py-2"
        style={{
          background: "#3D294D",
          boxShadow: "0 4px 6px -1px rgba(93, 75, 107, 0.3)",
        }}
        onClick={() => onAddToCart?.(product._id)}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

export default HomeProductCard;
