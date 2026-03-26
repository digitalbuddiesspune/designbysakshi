import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const normalizeStatus = (s) => (s === "pending" ? "confirm" : s);
const formatDateTime = (v) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const [status, setStatus] = useState("confirm");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const orderNumberLabel = useMemo(() => {
    if (!order) return "";
    return `#${order.orderNumber || order._id.slice(-6)}`;
  }, [order]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/admin/${id}`);
      if (!res.ok) throw new Error("Failed to load order");
      const data = await res.json();
      setOrder(data);
      setStatus(normalizeStatus(data?.status || "confirm"));
      setPaymentStatus(data?.paymentStatus || "unpaid");
    } catch (e) {
      console.error(e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const t = setInterval(fetchOrder, 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (nextStatus) => {
    if (!order?._id) return;
    setStatus(nextStatus);
    await fetch(`${API_URL}/orders/admin/${order._id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchOrder();
  };

  const timelineIndex = useMemo(() => {
    const s = normalizeStatus(order?.status);
    if (!s) return 0;
    if (s === "confirm") return 1;
    if (s === "processing") return 2;
    if (s === "shipped") return 3;
    if (s === "delivered") return 4;
    if (s === "returnable") return 4; // show on the "Delivered" step
    if (s === "cancelled") return 5;
    return 0;
  }, [order]);

  const sumTotal = (o) => (o?.items || []).reduce((s, it) => s + (it.quantity || 0) * (it.priceAtOrderTime || 0), 0);
  const subtotal = sumTotal(order);
  const delivery = subtotal > 699 ? 0 : 50;
  const discount = Math.max(0, subtotal + delivery - (order?.totalAmount || 0));
  const statusMap = useMemo(() => {
    const map = {};
    const hist = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
    hist.forEach((h) => {
      const key = normalizeStatus(h.status);
      if (key === "returnable") {
        if (!map.delivered) map.delivered = h.changedAt;
      } else if (!map[key]) {
        map[key] = h.changedAt;
      }
    });
    if (!map.confirm) map.confirm = order?.createdAt;
    return map;
  }, [order]);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            ← Orders
          </button>
          <div>
            <h1 className="text-3xl font-medium" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
              Order Details
            </h1>
            <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
              {loading ? "Loading..." : orderNumberLabel}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3"></div>
      </div>

      {loading || !order ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center" style={{ color: "var(--brand-muted)" }}>
          Loading...
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  ORDER ID
                </div>
                <div className="text-lg font-bold" style={{ color: "var(--brand-dark)" }}>
                  {orderNumberLabel}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand-muted)" }}>
                    ORDER STATUS
                  </div>
                  <select
                    value={status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  >
                    <option value="confirm">confirm</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="returnable">returnable</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand-muted)" }}>
                    PAYMENT STATUS
                  </div>
                  {(() => {
                    const ps = paymentStatus || "unpaid";
                    const badge =
                      ps === "paid"
                        ? "bg-green-100 text-green-800"
                        : ps === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800";
                    return (
                      <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${badge}`}>
                        {ps}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-5 items-start gap-3">
              {[
                { idx: 1, label: "Confirm" },
                { idx: 2, label: "Processing" },
                { idx: 3, label: "Shipped" },
                { idx: 4, label: "Delivered" },
                { idx: 5, label: "Cancelled" },
              ].map((step) => {
                const active = timelineIndex === step.idx;
                const done = timelineIndex >= step.idx && timelineIndex !== 0;
                const stepKey = step.label.toLowerCase();
                return (
                  <div key={step.idx} className="relative flex flex-col items-center">
                    {step.idx < 5 && (
                      <div
                        className="absolute top-5 left-1/2 w-full h-[2px]"
                        style={{
                          background:
                            timelineIndex > step.idx ? "#16a34a" : "rgba(148,163,184,0.35)",
                        }}
                      />
                    )}
                    <div
                      className="relative z-10 h-10 w-10 rounded-full border flex items-center justify-center"
                      style={{
                        background: done ? "#16a34a" : "white",
                        borderColor: done ? "#16a34a" : "var(--brand-lavender-soft)",
                        color: done ? "white" : "var(--brand-dark)",
                      }}
                    >
                      {done ? "✓" : step.idx}
                    </div>
                    <div className="mt-3 text-xs font-semibold" style={{ color: "var(--brand-muted)" }}>
                      {step.label}
                    </div>
                    <div className="mt-1 text-[10px]" style={{ color: "var(--brand-muted)" }}>
                      {formatDateTime(statusMap[stepKey])}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  CUSTOMER
                </div>
                <div className="font-bold" style={{ color: "var(--brand-dark)" }}>
                  {order.name}{" "}
                  <span className="text-sm font-medium" style={{ color: "var(--brand-muted)" }}>
                    ({order.email})
                  </span>
                </div>
                <div className="text-sm" style={{ color: "var(--brand-muted)" }}>
                  Phone: {order.phone}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  ADDRESS
                </div>
                <div className="text-sm" style={{ color: "var(--brand-dark)" }}>
                  {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </div>
                <div className="text-sm" style={{ color: "var(--brand-muted)" }}>
                  Payment Mode: {order.paymentMode} • Payment Status: {order.paymentStatus}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  TOTAL
                </div>
                <div className="text-lg font-bold" style={{ color: "var(--brand-dark)" }}>
                  ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-xs" style={{ color: "var(--brand-muted)" }}>
                Items total: ₹{sumTotal(order).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ color: "var(--brand-muted)" }}>
              <span className="text-sm font-semibold uppercase tracking-wider">Order Items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    <th className="text-left px-5 py-3">Item</th>
                    <th className="text-left px-5 py-3">Qty</th>
                    <th className="text-left px-5 py-3">Unit Price</th>
                    <th className="text-left px-5 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, idx) => {
                    const unit = it.priceAtOrderTime || 0;
                    const total = (it.quantity || 0) * unit;
                    return (
                      <tr key={idx} className="border-t">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={it.product?.image}
                                alt={it.product?.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold" style={{ color: "var(--brand-dark)" }}>
                                {it.product?.name || "Product"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">{it.quantity}</td>
                        <td className="px-5 py-4">₹{unit.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4">₹{total.toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-lg font-bold mb-3" style={{ color: "var(--brand-dark)" }}>
              Billing Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--brand-muted)" }}>Subtotal</span>
                <span style={{ color: "var(--brand-dark)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--brand-muted)" }}>Discount</span>
                <span className="text-green-600">-₹{discount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--brand-muted)" }}>18% GST</span>
                <span style={{ color: "var(--brand-dark)" }}>Included</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--brand-muted)" }}>Delivery Charges</span>
                <span style={{ color: delivery === 0 ? "#16a34a" : "var(--brand-dark)" }}>
                  {delivery === 0 ? "Free" : `₹${delivery.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex items-center justify-between text-base font-bold" style={{ color: "var(--brand-dark)" }}>
                <span>Total Amount</span>
                <span>₹{(order?.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

