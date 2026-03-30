import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

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

  // Free delivery above ₹699 (matches Checkout.jsx)
  const freeDeliveryThreshold = 699;
  const isDeliveryFree = total > freeDeliveryThreshold;
  const deliveryFee = isDeliveryFree ? 0 : 50;
  const grandTotal = total + deliveryFee;

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const changeQty = async (productId, delta) => {
    try {
      setBusyProductId(productId);
      const currentItem = items.find(
        (it) => String(it.product?._id || it.product) === String(productId)
      );
      const currentQty = Number(currentItem?.quantity || 0);
      const nextQty = currentQty + delta;

      await fetch(`${API_URL}/cart/set-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: nextQty, guestId }),
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

  const isEmpty = !loading && items.length === 0;

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
       

        <div className="mb-6">
        <h1 
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            Shopping Cart
          </h1>         
        </div>

        {/* ── Empty state: full-width centered card ── */}
        {isEmpty ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-10 py-16 shadow-2xl text-center">
            
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2">No Products Found</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Your cart is empty. Looks like you haven't added anything yet.<br />
                Start exploring and find something you love!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
               
                <Link
                  to="/"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition no-underline"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── Normal state: items + order summary grid ── */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Cart Items</div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                  disabled={loading}
                >
                  Clear Cart
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-gray-600">Loading cart...</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product?._id || item.product}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-gray-900">
                              {item.product?.name || "Product"}
                            </h2>
                            <div className="mt-1 text-xs text-gray-500">Size: 1000ml</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product?._id || item.product)}
                            className="rounded p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            aria-label="Remove"
                            disabled={busyProductId === (item.product?._id || item.product)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                              <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                              <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center overflow-hidden rounded-lg bg-gray-100">
                              <button
                                type="button"
                                onClick={() => changeQty(item.product?._id || item.product, -1)}
                                className="h-8 w-9 text-sm font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                disabled={busyProductId === (item.product?._id || item.product)}
                              >
                                −
                              </button>
                              <div className="h-8 w-10 text-center text-sm font-semibold leading-8 text-gray-900">
                                {item.quantity || 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => changeQty(item.product?._id || item.product, 1)}
                                className="h-8 w-9 text-sm font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                disabled={busyProductId === (item.product?._id || item.product)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-base font-extrabold text-gray-900">
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
            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>18% GST</span>
                  <span className="text-gray-600">Included</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  {isDeliveryFree ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                  )}
                </div>
                {!isDeliveryFree && (
                  <div className="text-xs text-green-600 mt-1">
                    Add ₹{(freeDeliveryThreshold - total).toLocaleString("en-IN")} more for free delivery!
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-xl bg-gray-800 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
              <div className="mt-3 text-center">
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;