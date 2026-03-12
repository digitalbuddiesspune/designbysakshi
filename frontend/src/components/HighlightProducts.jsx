import React from "react";
import highlightData from "../data/highlightProducts.json";

const HighlightProducts = () => {
  return (
    <section 
      className="py-8 sm:py-12 lg:py-16"
      style={{
        background: "linear-gradient(135deg, var(--brand-lavender-light) 0%, var(--brand-lavender-soft) 50%, var(--brand-lavender) 100%)"
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-8 text-center text-2xl font-medium sm:mb-10 sm:text-3xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Stories Behind Our Pieces
        </h2>

        <div className="space-y-8 lg:space-y-10">
          {highlightData.products.map((product, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={product.name}
                className={`grid items-center gap-6 lg:gap-8 ${
                  isReversed ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"
                }`}
              >
                {/* Image in square box with random hearts */}
                <div
                  className={`relative flex items-center justify-center ${
                    isReversed ? "lg:order-2" : ""
                  }`}
                >
                  <div
                    className="relative h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, var(--brand-lavender-soft) 0%, var(--brand-cream) 50%, var(--brand-lavender) 100%)",
                      borderRadius: "18px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />

                    {/* Light hearts placed around the box */}
                    {[
                      { top: "8%", left: "6%" },
                      { top: "15%", right: "10%" },
                      { bottom: "18%", left: "12%" },
                      { bottom: "8%", right: "8%" },
                    ].map((pos, i) => (
                      <svg
                        key={i}
                        className="absolute h-5 w-5 transition-transform duration-300 hover:scale-110"
                        style={{
                          
                          ...pos,
                        }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Text content */}
                <div className={`${isReversed ? "lg:order-1" : ""}`}>
                  <h3
                    className="mb-3 text-xl font-semibold sm:text-2xl"
                    style={{
                      color: "var(--brand-dark)",
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                    }}
                  >
                    {product.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700 sm:text-base">
                    {product.description.map((line) => (
                      <p key={line} className="flex items-start gap-2">
                        <svg
                          className="mt-1 h-4 w-4 flex-shrink-0"
                          style={{ color: "var(--brand-purple)" }}
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
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-gray-800">
                    {product.key_points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <svg
                          className="mt-1 h-4 w-4 flex-shrink-0"
                          style={{ color: "var(--brand-purple)" }}
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
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightProducts;

