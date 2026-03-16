import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getGuestId = () => {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("guestId");
  if (!id) {
    id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem("guestId", id);
  }
  return id;
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const guestId = getGuestId();
      const res = await fetch(
        `${API_URL}/wishlist?guestId=${encodeURIComponent(guestId)}`
      );
      const data = await res.json();
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const products = wishlist?.products || [];

  const removeFromWishlist = async (productId) => {
    try {
      const guestId = getGuestId();
      await fetch(`${API_URL}/wishlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      window.dispatchEvent(new Event("wishlist-updated"));
      await fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
         
        </div>

        {loading ? (
          <p style={{ color: "var(--brand-dark)" }}>Loading wishlist...</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-lg text-center">
            <div className="mb-4 text-5xl">🤍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm mb-6">You haven't saved anything yet. Get back to shopping!</p>
            <Link to="/" className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition">
              Go to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-md text-red-500 hover:bg-red-50 transition"
                    aria-label="Remove from wishlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
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
                  <p className="text-sm font-bold text-gray-900">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="block rounded-full border px-3 py-1.5 text-xs font-medium text-center no-underline transition hover:bg-gray-100"
                      style={{
                        borderColor: "var(--brand-lavender-soft)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

