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
      setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
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
        {/* 8 products: 2 rows × 4 columns (desktop), 4 rows × 2 columns (mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {products.map((product, index) => (
            <div key={`${product._id}-${index}`} className="group relative">
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

