import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openInvoiceWindow } from "../utils/invoice";

const API_URL = import.meta.env.VITE_API_URL;
const normalizeStatus = (s) => {
  if (s === "pending") return "confirm";
  if (s === "returnable") return "refundable";
  return s;
};
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

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to load order");
      const data = await res.json();
      setOrder(data);
    } catch (e) {
      console.error(e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrder();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const cancelOrder = async () => {
    if (!order?._id) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const res = await fetch(`${API_URL}/orders/${order._id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await fetchOrder();
    }
  };

  const timelineIndex = useMemo(() => {
    const s = normalizeStatus(order?.status);
    if (!s) return 0;
    if (s === "confirm") return 1;
    if (s === "processing") return 2;
    if (s === "shipped") return 3;
    if (s === "delivered") return 4;
    if (s === "refundable") return 4; // show on the "Delivered" step
    if (s === "cancelled") return 5;
    return 0;
  }, [order]);

  const canCancel = ["confirm", "pending"].includes(order?.status);
  const itemsSubtotal = useMemo(
    () =>
      (order?.items || []).reduce(
        (sum, it) => sum + (Number(it?.quantity || 0) * Number(it?.priceAtOrderTime || 0)),
        0
      ),
    [order]
  );
  const couponDiscount = Number(order?.discountAmount || 0);
  const inferredDelivery = Math.max(0, Number(order?.totalAmount || 0) - itemsSubtotal + couponDiscount);
  const statusMap = useMemo(() => {
    const map = {};
    const hist = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
    hist.forEach((h) => {
      const key = normalizeStatus(h.status);
      if (key === "refundable") {
        if (!map.delivered) map.delivered = h.changedAt;
      } else if (!map[key]) {
        map[key] = h.changedAt;
      }
    });
    if (!map.confirm) map.confirm = order?.createdAt;
    return map;
  }, [order]);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            >
              ← My Orders
            </button>
            {!loading && order ? (
              <button
                type="button"
                onClick={() => openInvoiceWindow(order)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
              >
                Bill Invoice
              </button>
            ) : null}
          </div>
          <div>
            <h1
              className="text-3xl lg:text-4xl font-semibold text-center md:text-left"
              style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              Order Details
            </h1>
            <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
              {loading ? "Loading..." : `#${order?.orderNumber || order?._id?.slice(-6)}`}
            </p>
          </div>
        </div>

        {loading || !order ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center" style={{ color: "var(--brand-muted)" }}>
            Loading...
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    STATUS
                  </div>
                  <div className="font-bold" style={{ color: "var(--brand-dark)" }}>
                    {normalizeStatus(order.status)}
                  </div>
                  <div className="text-sm" style={{ color: "var(--brand-muted)" }}>
                    Payment: {order.paymentMode} • {order.paymentStatus || "unpaid"}
                  </div>
                </div>

                {canCancel && (
                  <button
                    type="button"
                    onClick={cancelOrder}
                    className="rounded-full px-6 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                    style={{ background: "#3D294D" }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-5 items-start gap-3">
                {[
                  { idx: 1, label: "Confirm" },
                  { idx: 2, label: "Processing" },
                  { idx: 3, label: "Shipped" },
                  { idx: 4, label: "Delivered" },
                  { idx: 5, label: "Cancelled" },
                ].map((step) => {
                  const isCancelledFlow = timelineIndex === 5;
                  const done = isCancelledFlow
                    ? step.idx === 1 || step.idx === 5
                    : timelineIndex >= step.idx && timelineIndex !== 0;
                  const stepKey = step.label.toLowerCase();
                  return (
                    <div key={step.idx} className="relative flex flex-col items-center">
                      {step.idx < 5 && (
                        <div
                          className="absolute top-5 left-1/2 w-full h-[2px]"
                          style={{
                            background: isCancelledFlow
                              ? "rgba(148,163,184,0.35)"
                              : timelineIndex > step.idx
                                ? "#16a34a"
                                : "rgba(148,163,184,0.35)",
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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    ADDRESS
                  </div>
                  <div className="text-sm mt-2" style={{ color: "var(--brand-dark)" }}>
                    {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
                    Phone: {order.address?.phone}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    BILLING SUMMARY
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--brand-muted)" }}>Subtotal</span>
                      <span style={{ color: "var(--brand-dark)" }}>₹{itemsSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {couponDiscount > 0 ? (
                      <div className="flex items-center justify-between">
                        <span style={{ color: "var(--brand-muted)" }}>
                          Coupon{order?.couponCode ? ` (${order.couponCode})` : ""}
                        </span>
                        <span className="text-green-600">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--brand-muted)" }}>GST</span>
                      <span style={{ color: "var(--brand-dark)" }}>Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "var(--brand-muted)" }}>Delivery</span>
                      <span style={{ color: inferredDelivery === 0 ? "#16a34a" : "var(--brand-dark)" }}>
                        {inferredDelivery === 0 ? "Free" : `₹${inferredDelivery.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold mt-2" style={{ color: "var(--brand-dark)" }}>
                    Total: ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
                    Order Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : ""}
                  </div>
                </div>
              </div>
            </div>

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
                              <div className="font-semibold" style={{ color: "var(--brand-dark)" }}>
                                {it.product?.name || "Product"}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;

