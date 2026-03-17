import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

const getStoredAddresses = (guestId) => {
  try {
    const raw = localStorage.getItem(`addresses_${guestId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredAddresses = (guestId, addresses) => {
  localStorage.setItem(`addresses_${guestId}`, JSON.stringify(addresses));
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem || null;
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const guestId = useMemo(() => getGuestId(), []);
  const [addresses, setAddresses] = useState(() => getStoredAddresses(guestId));
  const [selectedAddressId, setSelectedAddressId] = useState(
    () => getStoredAddresses(guestId).find((a) => a?.isDefault)?.id || getStoredAddresses(guestId)[0]?.id || ""
  );

  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

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

  useEffect(() => {
    saveStoredAddresses(guestId, addresses);
  }, [addresses, guestId]);

  const items = buyNowItem ? [buyNowItem] : (cart?.items || []);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.priceAtAddTime || 0) * (item.quantity || 1),
    0
  );

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleAddAddress = (e) => {
    e.preventDefault();
    const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const addr = { ...newAddress, id, isDefault: addresses.length === 0 };
    const next = [addr, ...addresses];
    setAddresses(next);
    setSelectedAddressId(addr.id);
    setNewAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    });
    setShowNewAddress(false);
  };

  // Price calculation
  const isDeliveryFree = subtotal > 500;
  const deliveryFee = isDeliveryFree ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!items.length) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      setShowNewAddress(true);
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        items: items.map(item => ({
          product: item.product?._id || item.product,
          quantity: item.quantity || 1,
          price: item.priceAtAddTime || 0,
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMode,
        totalAmount: grandTotal,
      };

      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        console.error("Order creation failed:", err);
        return;
      }

      // Only clear the full cart if this was a normal cart checkout
      if (!buyNowItem) {
        await fetch(`${API_URL}/cart/clear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId }),
        });
        window.dispatchEvent(new Event("cart-updated"));
      }

      setShowConfirmModal(true);
    } catch (e) {
      console.error("Place order failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="w-full mb-6 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Checkout</h1>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 justify-between items-start">
          {/* Left: Payment & Address */}
          <div className="flex-1 w-full lg:max-w-2xl xl:max-w-3xl space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-900 bg-gray-50 p-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMode === "cash"}
                    onChange={() => setPaymentMode("cash")}
                    className="mt-1 h-5 w-5 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <div className="text-base font-bold text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMode === "online"}
                    onChange={() => setPaymentMode("online")}
                    className="mt-1 h-5 w-5 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <div className="text-base font-bold text-gray-900">Pay Online</div>
                    <div className="text-sm text-gray-600">UPI, Cards, Net Banking</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Deliver To</h2>
              </div>

              <div className="mt-4 space-y-3">
                {addresses.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-600">
                    No saved address yet. Add one to continue.
                  </div>
                )}

                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      selectedAddressId === a.id ? "border-gray-900 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                      className="mt-1 h-5 w-5 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-gray-900">{a.fullName || "Address"}</span>
                        {a.isDefault && (
                          <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-800 tracking-wider">
                            HOME
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {[a.street, a.landmark, a.city, a.state, a.pincode].filter(Boolean).join(", ")}
                      </div>
                      {a.phone && <div className="mt-1 text-sm font-medium text-gray-700">{a.phone}</div>}
                    </div>
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => setShowNewAddress((s) => !s)}
                  className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
                >
                  + Add New Address
                </button>

                {showNewAddress && (
                  <form onSubmit={handleAddAddress} className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">New Address</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress((p) => ({ ...p, fullName: e.target.value }))}
                        required
                      />
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress((p) => ({ ...p, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="Street / Area"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                        required
                      />
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="Landmark (optional)"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress((p) => ({ ...p, landmark: e.target.value }))}
                      />
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                        required
                      />
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                        required
                      />
                      <input
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress((p) => ({ ...p, pincode: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewAddress(false)}
                        className="rounded-lg px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition shadow-md"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0 ml-auto">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="mt-5 space-y-4">
                {loading ? (
                  <div className="text-sm text-gray-600">Loading...</div>
                ) : items.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    Your cart is empty.{" "}
                    <Link to="/cart" className="text-gray-900 font-bold hover:underline">
                      Go back
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product?._id || item.product} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-base font-bold text-gray-900">
                          {item.product?.name || "Product"}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">Qty: {item.quantity || 1}</div>
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        ₹{((item.priceAtAddTime || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
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
                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free delivery!
                  </div>
                )}
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={loading || items.length === 0}
                onClick={handlePlaceOrder}
                className="mt-8 w-full rounded-xl bg-gray-900 px-5 py-3.5 text-base font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition shadow-lg hover:shadow-xl"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              <div className="mt-4 text-center">
                <Link to="/cart" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmed Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-6">Your order has been placed successfully. Keep shopping!</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition no-underline"
              >
                Go to Home
              </Link>
              <Link
                to="/orders"
                className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition no-underline"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

