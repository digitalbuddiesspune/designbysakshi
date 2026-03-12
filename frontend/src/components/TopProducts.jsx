import React, { useState } from "react";
import productsData from "../data/products.json";

const TopProducts = () => {
  const [products] = useState(productsData.products);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-10 text-center text-3xl font-medium sm:mb-12 sm:text-4xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Top Products
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Top Products Tag */}
              <div 
                className="absolute left-0 top-2 z-10 px-3 py-1 text-xs font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)"
                }}
              >
                Top Products
              </div>

              {/* Image Container */}
              <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Heart Icon - Wishlist */}
                <button
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300"
                  style={{
                    "--hover-bg": "var(--brand-lavender-soft)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--brand-lavender-soft)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  aria-label="Add to wishlist"
                >
                  <svg
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Rating */}
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Product Name */}
                <h3
                  className="mb-2 text-sm font-semibold text-gray-900 sm:text-base"
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                  }}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>

                {/* Offer */}
                <p 
                  className="mb-3 text-xs font-medium"
                  style={{ color: "var(--brand-purple)" }}
                >
                  {product.offer}
                </p>

                {/* Add to Cart Button */}
                <button 
                  className="w-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                    boxShadow: "0 4px 6px -1px rgba(93, 75, 107, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, var(--brand-lavender-soft) 0%, var(--brand-lavender) 100%)";
                    e.currentTarget.style.boxShadow = "0 6px 8px -1px rgba(93, 75, 107, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(93, 75, 107, 0.3)";
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
