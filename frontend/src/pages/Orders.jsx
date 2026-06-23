import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRatingPicker from "../components/StarRatingPicker";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeStatus = (s) => {
  if (s === "pending") return "confirm";
  if (s === "returnable") return "refundable";
  return s;
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewProductId, setSelectedReviewProductId] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ stars: 5, review: "", image: "" });

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
  }, [navigate]);

  const handleOpenReviewModal = (productId, e) => {
    e?.stopPropagation();
    if (!productId) return;
    setSelectedReviewProductId(productId);
    setReviewForm({ stars: 5, review: "", image: "" });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!selectedReviewProductId) return;

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
      alert("Review submitted successfully.");
      setShowReviewModal(false);
      setSelectedReviewProductId("");
    } catch (err) {
      console.error("Submit review failed:", err);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const statusColor = (status) => {
    const s = normalizeStatus(status);
    const map = {
      confirm: "bg-blue-100 text-blue-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      refundable: "bg-teal-100 text-teal-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[s] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-gray-50">
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
              {orders.map((order) => {
                const reviewProductId = order.items?.find((item) => item?.product?._id)?.product?._id;
                return (
                  <div
                    key={order._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/orders/${order._id}`);
                      }
                    }}
                    className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-[#3D294D]/20 hover:shadow-md"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-bold text-gray-700">
                        #{order.orderNumber || order._id.slice(-6)}
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                        <span className="hidden text-xs text-gray-500 md:inline">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusColor(order.status)}`}
                        >
                          {normalizeStatus(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-semibold text-gray-900">
                              {item.product?.name || "Product"}
                            </div>
                            <div className="text-[11px] text-gray-400">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {reviewProductId ? (
                      <div
                        className="mt-3 flex justify-end border-t border-gray-50 pt-3"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        role="presentation"
                      >
                        <button
                          type="button"
                          onClick={(e) => handleOpenReviewModal(reviewProductId, e)}
                          className="bg-transparent px-0 py-1.5 text-sm font-semibold transition hover:opacity-80 sm:text-base"
                          style={{ color: "#3D294D" }}
                        >
                          Add Review
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Add Review</h3>
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Write your review..."
              />
              <input
                type="url"
                value={reviewForm.image}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional image URL"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="rounded-full bg-[#3D294D] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
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

export default Orders;
