import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState(null);

  const guestId = useMemo(() => getGuestId(), []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart?guestId=${encodeURIComponent(guestId)}`);
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.priceAtAddTime || 0) * (item.quantity || 1),
    0
  );

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const changeQty = async (productId, delta) => {
    try {
      setBusyProductId(productId);
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: delta, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      await fetchCart();
    } catch (e) {
      console.error("Cart update failed:", e);
    } finally {
      setBusyProductId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setBusyProductId(productId);
      await fetch(`${API_URL}/cart/set-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 0, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      await fetchCart();
    } catch (e) {
      console.error("Remove item failed:", e);
    } finally {
      setBusyProductId(null);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await fetch(`${API_URL}/cart/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      await fetchCart();
    } catch (e) {
      console.error("Clear cart failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Delivery Fee logic
  const isDeliveryFree = total > 500;
  const deliveryFee = isDeliveryFree ? 0 : 50;
  const grandTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Removed breadcrumbs and item count per user request. Shifted content up by reducing margin. */}
        <div className="w-full mb-6 text-left">
          <h1 className="text-4xl sm:text-3xl font-bold text-gray-700">Shopping Cart</h1>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 justify-between items-start">
          {/* Left: Cart Items */}
          <div className="flex-1 w-full lg:max-w-4xl xl:max-w-5xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-semibold text-gray-900"></div>
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                disabled={loading || items.length === 0}
              >
                Clear Cart
              </button>
            </div>
            {loading ? (
              <p className="text-base text-gray-600">Loading cart...</p>
            ) : items.length === 0 ? (
              <p className="text-base text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product?._id || item.product}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 w-full">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                            {item.product?.name || "Product"}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product?._id || item.product)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                          aria-label="Remove"
                          disabled={busyProductId === (item.product?._id || item.product)}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                            <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                            <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <button
                              type="button"
                              onClick={() => changeQty(item.product?._id || item.product, -1)}
                              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition"
                              disabled={busyProductId === (item.product?._id || item.product)}
                            >
                              −
                            </button>
                            <div className="flex h-10 w-12 items-center justify-center text-base font-semibold text-gray-900">
                              {item.quantity || 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => changeQty(item.product?._id || item.product, 1)}
                              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition"
                              disabled={busyProductId === (item.product?._id || item.product)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-xl font-extrabold text-gray-900">
                          ₹{((item.priceAtAddTime || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-72 flex-shrink-0 ml-auto pt-8">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  {isDeliveryFree ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹50</span>
                  )}
                </div>
                {!isDeliveryFree && (
                  <div className="text-xs text-green-600 mt-1">
                    Add ₹{(500 - total).toLocaleString("en-IN")} more for!
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="button"
                disabled={loading || items.length === 0}
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition shadow hover:shadow-md"
              >
                Proceed to Checkout
              </button>

              <div className="mt-3 text-center">
                <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

