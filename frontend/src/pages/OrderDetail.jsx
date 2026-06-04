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
        <div className="mb-6 flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition hover:bg-gray-50"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            aria-label="Back to My Orders"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1
              className="text-3xl font-semibold lg:text-4xl"
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
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--brand-muted)" }}
                  >
                    STATUS
                  </span>
                  <span className="font-bold capitalize" style={{ color: "var(--brand-dark)" }}>
                    {normalizeStatus(order.status)}
                  </span>
                </div>
                {canCancel && (
                  <button
                    type="button"
                    onClick={cancelOrder}
                    className="shrink-0 bg-transparent px-0 text-sm font-semibold transition hover:opacity-80"
                    style={{ color: "#3D294D" }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              {(() => {
                const steps = [
                  { idx: 1, label: "Confirm" },
                  { idx: 2, label: "Processing" },
                  { idx: 3, label: "Shipped" },
                  { idx: 4, label: "Delivered" },
                  { idx: 5, label: "Cancelled" },
                ];
                const renderStepState = (step) => {
                  const isCancelledFlow = timelineIndex === 5;
                  const done = isCancelledFlow
                    ? step.idx === 1 || step.idx === 5
                    : timelineIndex >= step.idx && timelineIndex !== 0;
                  const stepKey = step.label.toLowerCase();
                  const lineActive = !isCancelledFlow && timelineIndex > step.idx;
                  return { done, stepKey, lineActive, isCancelledFlow };
                };

                return (
                  <>
                    {/* Mobile: vertical stepper */}
                    <div className="flex flex-col md:hidden">
                      {steps.map((step, i) => {
                        const { done, stepKey, lineActive } = renderStepState(step);
                        return (
                          <div key={step.idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
                                style={{
                                  background: done ? "#16a34a" : "white",
                                  borderColor: done ? "#16a34a" : "var(--brand-lavender-soft)",
                                  color: done ? "white" : "var(--brand-dark)",
                                }}
                              >
                                {done ? "✓" : step.idx}
                              </div>
                              {i < steps.length - 1 && (
                                <div
                                  className="my-1 w-0.5 min-h-[28px] flex-1"
                                  style={{
                                    background: lineActive ? "#16a34a" : "rgba(148,163,184,0.35)",
                                  }}
                                />
                              )}
                            </div>
                            <div className={`min-w-0 flex-1 ${i < steps.length - 1 ? "pb-4" : "pb-0"}`}>
                              <div className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
                                {step.label}
                              </div>
                              <div className="mt-0.5 text-xs" style={{ color: "var(--brand-muted)" }}>
                                {formatDateTime(statusMap[stepKey])}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop: horizontal stepper */}
                    <div className="hidden grid-cols-5 items-start gap-3 md:grid">
                      {steps.map((step) => {
                        const { done, stepKey, isCancelledFlow } = renderStepState(step);
                        return (
                          <div key={step.idx} className="relative flex flex-col items-center">
                            {step.idx < 5 && (
                              <div
                                className="absolute top-5 left-1/2 h-[2px] w-full"
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
                              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border"
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
                  </>
                );
              })()}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-900">
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
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-900">
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
              <div className="border-b px-3 py-2.5 md:px-5 md:py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 md:text-sm">
                  <span className="md:hidden">Order Itms</span>
                  <span className="hidden md:inline">Order Items</span>
                </span>
              </div>
              <div className="overflow-hidden md:overflow-x-auto">
                <table className="w-full table-fixed text-[10px] md:text-sm">
                  <colgroup>
                    <col className="w-[40%] md:w-auto" />
                    <col className="w-[10%] md:w-auto" />
                    <col className="w-[25%] md:w-auto" />
                    <col className="w-[25%] md:w-auto" />
                  </colgroup>
                  <thead>
                    <tr
                      className="text-[9px] uppercase tracking-wide md:text-xs md:tracking-wider"
                      style={{ color: "var(--brand-muted)" }}
                    >
                      <th className="px-2 py-2 text-left font-semibold md:px-5 md:py-3">
                        <span className="md:hidden">Itm</span>
                        <span className="hidden md:inline">Item</span>
                      </th>
                      <th className="px-1 py-2 text-center font-semibold md:px-5 md:py-3 md:text-left">
                        Qty
                      </th>
                      <th className="px-1 py-2 text-right font-semibold md:px-5 md:py-3 md:text-left">
                        <span className="md:hidden">Rate</span>
                        <span className="hidden md:inline">Unit Price</span>
                      </th>
                      <th className="px-2 py-2 text-right font-semibold md:px-5 md:py-3 md:text-left">
                        <span className="md:hidden">Amt</span>
                        <span className="hidden md:inline">Total</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, idx) => {
                      const unit = it.priceAtOrderTime || 0;
                      const total = (it.quantity || 0) * unit;
                      return (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2 md:px-5 md:py-4">
                            <div className="flex items-center gap-1.5 md:gap-3">
                              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 md:h-12 md:w-12 md:rounded-lg">
                                <img
                                  src={it.product?.image}
                                  alt={it.product?.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div
                                className="line-clamp-2 min-w-0 font-semibold leading-tight md:line-clamp-none md:text-base"
                                style={{ color: "var(--brand-dark)" }}
                              >
                                {it.product?.name || "Product"}
                              </div>
                            </div>
                          </td>
                          <td className="px-1 py-2 text-center align-middle md:px-5 md:py-4 md:text-left">
                            {it.quantity}
                          </td>
                          <td className="whitespace-nowrap px-1 py-2 text-right align-middle md:px-5 md:py-4 md:text-left">
                            ₹{unit.toLocaleString("en-IN")}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-right align-middle font-semibold md:px-5 md:py-4 md:text-left md:font-normal">
                            ₹{total.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center pt-2 md:justify-end">
              <button
                type="button"
                onClick={() => openInvoiceWindow(order)}
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
              >
                Bill Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;

