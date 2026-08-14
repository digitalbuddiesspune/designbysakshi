import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openInvoiceWindow } from "../utils/invoice";
import StarRatingPicker from "../components/StarRatingPicker";

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewProductId, setSelectedReviewProductId] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ stars: 5, review: "", image: "" });

  const token = useMemo(() => localStorage.getItem("token"), []);

  const handleOpenReviewModal = (productId) => {
    if (!productId) return;
    setSelectedReviewProductId(productId);
    setReviewForm({ stars: 5, review: "", image: "" });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReviewProductId || !token) return;
    const reviewText = String(reviewForm.review || "").trim();
    if (!reviewText) {
      alert("Please write your review.");
      return;
    }
    try {
      setReviewSubmitting(true);
      const res = await fetch(`${API_URL}/products/${selectedReviewProductId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stars: Number(reviewForm.stars),
          review: reviewText,
          image: reviewForm.image,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Failed to submit review");
        return;
      }
      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setSelectedReviewProductId("");
    } catch (err) {
      console.error("Submit review failed:", err);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

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

  const requestReturn = async () => {
    if (!order?._id) return;
    if (!order.canReturn) return;
    if (!window.confirm("Request a return for this order? You can only return within 24 hours of delivery.")) {
      return;
    }
    const res = await fetch(`${API_URL}/orders/${order._id}/return`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.message || "Unable to request return");
      await fetchOrder();
      return;
    }
    await fetchOrder();
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
  const statusNormalized = normalizeStatus(order?.status);
  const showReturnAction = statusNormalized === "delivered" || statusNormalized === "refundable";
  const canReturn = Boolean(order?.canReturn);
  const returnExpired =
    showReturnAction &&
    !canReturn &&
    statusNormalized === "delivered" &&
    String(order?.returnMessage || "").toLowerCase().includes("expired");
  const returnAlreadyRequested = statusNormalized === "refundable";
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
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={cancelOrder}
                      className="bg-transparent px-0 text-sm font-semibold transition hover:opacity-80"
                      style={{ color: "#3D294D" }}
                    >
                      Cancel Order
                    </button>
                  )}
                  {showReturnAction && (
                    <button
                      type="button"
                      onClick={requestReturn}
                      disabled={!canReturn}
                      className="rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45"
                      style={{ borderColor: "#3D294D", color: "#3D294D" }}
                      title={
                        canReturn
                          ? "Return within 24 hours of delivery"
                          : order?.returnMessage || "Return not available"
                      }
                    >
                      {returnAlreadyRequested
                        ? "Return Requested"
                        : returnExpired
                          ? "Return Expired"
                          : "Return Item"}
                    </button>
                  )}
                </div>
              </div>
              {showReturnAction && (
                <p className="mt-3 text-xs" style={{ color: "var(--brand-muted)" }}>
                  {canReturn
                    ? `Return available until ${formatDateTime(order.returnExpiresAt)}`
                    : order.returnMessage || "Return is not available for this order."}
                </p>
              )}
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
                      const imageSrc = it.variantImage || it.product?.image;
                      const variantLabel = [it.variantColor, it.variantSize]
                        .filter(Boolean)
                        .join(" / ");
                      return (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-2 md:px-5 md:py-4">
                            <div className="flex items-center gap-1.5 md:gap-3">
                              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 md:h-12 md:w-12 md:rounded-lg">
                                <img
                                  src={imageSrc}
                                  alt={it.product?.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className="line-clamp-2 font-semibold leading-tight md:line-clamp-none md:text-base"
                                  style={{ color: "var(--brand-dark)" }}
                                >
                                  {it.product?.name || "Product"}
                                </div>
                                {variantLabel ? (
                                  <div className="mt-0.5 text-[10px] md:text-xs" style={{ color: "var(--brand-muted)" }}>
                                    {variantLabel}
                                  </div>
                                ) : null}
                                {it.product?._id && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReviewModal(it.product._id)}
                                    className="mt-1 flex items-center gap-1 text-[11px] font-semibold hover:underline md:text-xs"
                                    style={{ color: "#3D294D" }}
                                  >
                                    <span className="text-amber-500">★</span> Write a Review
                                  </button>
                                )}
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

      {showReviewModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedReviewProductId("");
                }}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close review modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <StarRatingPicker
                label="Your rating"
                value={reviewForm.stars}
                onChange={(stars) => setReviewForm((prev) => ({ ...prev, stars }))}
              />
              <textarea
                rows={4}
                value={reviewForm.review}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, review: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D294D]/30"
                placeholder="Write your review about the product..."
              />
              <input
                type="url"
                value={reviewForm.image}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D294D]/30"
                placeholder="Optional image URL"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full rounded-full bg-[#3D294D] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

