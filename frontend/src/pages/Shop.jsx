import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (searchQuery) {
    return (
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            className="mb-8 text-center text-3xl font-medium sm:text-4xl"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Search Results for "{searchQuery}"
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.discountedPrice && (
                      <div
                        className="absolute left-0 top-2 z-10 px-3 py-1 text-xs font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                        }}
                      >
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2"
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.discountedPrice ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.discountedPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            Shop
          </h1>
          <p
            className="mx-auto max-w-xl text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Handcrafted pieces for every moment
          </p>

          <p className="mt-12 text-center text-sm" style={{ color: "var(--brand-muted)" }}>
            Browse by category in the navigation bar above.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Shop;
