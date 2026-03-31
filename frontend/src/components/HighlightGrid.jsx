import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const HighlightGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      const response = await fetch(`${API_URL}/products?category=bestseller`);
      const data = await response.json();
      setProducts(data.slice(0, 8)); // Fetch up to 8 bestsellers
    } catch (error) {
      console.error("Error fetching bestseller products:", error);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (!products.length) return null;

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        {/* Mobile: horizontal cards */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide md:hidden">
          {products.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="group relative w-[72vw] max-w-[300px] min-w-[240px] flex-shrink-0"
            >
                <Link to={`/product/${product._id}`}>
                  <div
                    className="relative w-full overflow-hidden rounded-2xl bg-transparent"
                    style={{
                      aspectRatio: "1/1",
                    }}
                  >
                    <div
                      className="absolute left-0 top-3 z-10 px-3 py-1 text-xs font-semibold text-white shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                      }}
                    >
                      Bestseller
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    />

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

                    <div className="absolute left-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white shadow-sm z-10">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </Link>
            </div>
          ))}
        </div>

        {/* Tablet/Desktop: clean equal grid (fixes iPad mini broken look) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {products.slice(0, 8).map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="group relative"
            >
              <Link to={`/product/${product._id}`}>
                <div className="relative w-full overflow-hidden rounded-2xl bg-transparent aspect-square">
                  <div
                    className="absolute left-0 top-3 z-10 px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                  >
                    Bestseller
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute right-3 top-3 z-10">
                    <svg className="h-5 w-5" style={{ color: "#000000" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4m16 0V9a2 2 0 00-2-2h-3.5M4 12V9a2 2 0 012-2h3.5m0 0A2.5 2.5 0 1112 9.5V7m0 0V4.5A2.5 2.5 0 1115.5 7H12z" />
                    </svg>
                  </div>
                  <div className="absolute left-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white shadow-sm z-10">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightGrid;

