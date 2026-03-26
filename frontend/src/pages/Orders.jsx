import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
const normalizeStatus = (s) => (s === "pending" ? "confirm" : s);

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const guestId = useMemo(() => getGuestId(), []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else if (res.status === 401) {
          // Token missing/expired/invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const t = setInterval(fetchOrders, 3000);
    return () => clearInterval(t);
  }, [guestId, navigate]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
        );
      }
    } catch (err) {
      console.error("Cancel order failed:", err);
    }
  };

  const statusColor = (status) => {
    const s = normalizeStatus(status);
    const map = {
      confirm: "bg-blue-100 text-blue-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      returnable: "bg-teal-100 text-teal-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[s] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
          <h1
            className="text-3xl lg:text-4xl font-semibold text-center"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            My Orders
          </h1>
         
        </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-600 text-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-lg text-center">
              <div className="mb-4 text-5xl">📦</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
              <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet. Get back to shopping!</p>
              <a href="/" className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition">
                Go to Home
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
      <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
  {/* Top row: order number, total, date, status */}
  <div className="flex items-center justify-between mb-3">
    <div className="text-xs font-bold text-gray-700">
      #{order.orderNumber || order._id.slice(-6)}
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <div className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString("en-IN")}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusColor(order.status)}`}>
          {normalizeStatus(order.status)}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
            order.paymentStatus === "paid"
              ? "bg-green-100 text-green-800"
              : order.paymentStatus === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.paymentStatus || "unpaid"}
        </span>
      </div>
    </div>
  </div>

  {/* Products */}
  <div className="divide-y divide-gray-50">
    {order.items.map((item, idx) => (
      <div key={idx} className="flex items-center gap-3 py-2">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {item.product?.image && (
            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-gray-900 truncate">{item.product?.name || "Product"}</div>
          <div className="text-[11px] text-gray-400">Qty: {item.quantity}</div>
        </div>
      </div>
    ))}
  </div>

  {/* Action buttons — compact, right-aligned */}
  <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3 justify-end">
    <Link
      to={`/orders/${order._id}`}
      className="rounded-lg border border-gray-300 px-4 py-1.5 text-center text-xs font-semibold text-gray-700 hover:bg-gray-50 transition no-underline"
    >
      View Details
    </Link>
    <button
      type="button"
      onClick={() => cancelOrder(order._id)}
      disabled={["processing", "shipped", "delivered", "returnable", "cancelled"].includes(normalizeStatus(order.status))}
      className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Cancel Order
    </button>
  </div>
</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
