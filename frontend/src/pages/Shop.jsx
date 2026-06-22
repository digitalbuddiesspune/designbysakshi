import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = async (productId) => {
    try {
      const guestId = getGuestId();
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Could not add to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      if (res.ok) setWishlistedIds((prev) => new Set([...prev, productId]));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Could not add to wishlist. Please try again.");
    }
  };

  if (searchQuery) {
    return (
      <div className="min-h-screen bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 text-left sm:mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
              Search results for
            </p>
            <h1
              className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              &ldquo;{searchQuery}&rdquo;
            </h1>
          </div>

          {loading ? (
            <div className="py-12 text-left">
              <p className="text-sm text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-left">
              <p className="text-sm text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="group relative block bg-white shadow-sm transition-all duration-300 hover:shadow-lg no-underline"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToWishlist(product._id);
                      }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill={wishlistedIds.has(product._id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          color: wishlistedIds.has(product._id) ? "var(--brand-purple)" : "#4b5563",
                        }}
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
                  <div className="p-4">
                    <h3
                      className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base"
                      style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="flex min-h-8 w-full items-center justify-center rounded-full px-1.5 py-1 text-[9px] font-semibold text-white whitespace-nowrap transition hover:opacity-95 sm:min-h-10 sm:px-3 sm:py-1.5 sm:text-xs"
                        style={{ background: "#3D294D" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                      >
                        Add to Cart
                      </button>
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
