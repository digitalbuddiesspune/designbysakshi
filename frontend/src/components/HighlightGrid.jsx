import React from "react";
import highlightData from "../data/highlightProducts.json";

const HighlightGrid = () => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14">
      {/* Horizontal Scrollable Container - Shows exactly 5 at a time with minimal side padding */}
      <div 
        className="overflow-x-auto scrollbar-hide"
        style={{
          paddingLeft: "12px",
          paddingRight: "12px"
        }}
      >
        <div 
          className="flex gap-3 sm:gap-6 pb-4"
          style={{ 
            width: "max-content"
          }}
        >
            {highlightData.products.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="group relative flex-shrink-0 highlight-product-card"
              >
                <div 
                  className="relative w-full overflow-hidden rounded-2xl bg-transparent"
                  style={{
                    aspectRatio: "1/1" // Square aspect ratio
                  }}
                >
                  {/* Product image - full size with rounded corners */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gift icon top-right - black color, no background */}
                  <div className="absolute right-3 top-3 z-10">
                    <svg
                      className="h-5 w-5 transition-transform duration-300 hover:scale-110"
                      style={{ color: "#000000" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4m16 0V9a2 2 0 00-2-2h-3.5M4 12V9a2 2 0 012-2h3.5m0 0A2.5 2.5 0 1112 9.5V7m0 0V4.5A2.5 2.5 0 1115.5 7H12z"
                      />
                    </svg>
                  </div>

                  {/* Price bottom-left on image - ensure it stays inside */}
                  <div className="absolute left-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white shadow-sm z-10">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightGrid;

