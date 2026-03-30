import React, { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Payments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("paymentStatus", paymentStatus);
    params.set("paymentMethod", paymentMethod);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    return params.toString();
  }, [startDate, endDate, paymentStatus, paymentMethod, sortBy, sortOrder]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/admin/payments?${query}`);
      if (!res.ok) throw new Error("Failed to load payments");
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const statusBadge = (s) => {
    if (s === "paid") return "bg-green-100 text-green-800";
    if (s === "failed") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const methodLabel = (m) => (m === "cash" ? "COD" : "Online");
  const qty = (items) => (Array.isArray(items) ? items.reduce((n, it) => n + Number(it?.quantity || 0), 0) : 0);
  const productLabel = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";
    const first = items[0]?.product?.name || items[0]?.name || "Product";
    if (items.length === 1) return first;
    return `${first} +${items.length - 1} more`;
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1
          className="text-3xl font-medium mb-2"
          style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Payments
        </h1>
        <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
          {payments.length} records
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>START DATE</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>END DATE</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>PAYMENT STATUS</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>PAYMENT METHOD</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}>
              <option value="all">All</option>
              <option value="online">Online</option>
              <option value="cash">COD</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>SORT BY</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}>
              <option value="date">Date</option>
              <option value="paymentStatus">Payment Status</option>
              <option value="paymentMethod">Payment Method</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>SORT ORDER</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="text-left px-5 py-4">Order ID</th>
              <th className="text-left px-5 py-4">Email</th>
              <th className="text-left px-5 py-4">Product</th>
              <th className="text-left px-5 py-4">Qty</th>
              <th className="text-left px-5 py-4">Order Date</th>
              <th className="text-left px-5 py-4">Status</th>
              <th className="text-left px-5 py-4">Method</th>
              <th className="text-left px-5 py-4">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>No payment records found</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-5 py-4">
                    {p?.order?.orderNumber ? `#${p.order.orderNumber}` : p?.order?._id || "-"}
                  </td>
                  <td className="px-5 py-4">{p?.email || p?.user?.email || "-"}</td>
                  <td className="px-5 py-4">{productLabel(p?.items)}</td>
                  <td className="px-5 py-4">{qty(p?.items)}</td>
                  <td className="px-5 py-4">
                    {p?.createdAt ? new Date(p.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-0.5 text-[10px] font-semibold ${statusBadge(p?.paymentStatus)}`}>
                      {p?.paymentStatus || "unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-4">{methodLabel(p?.paymentMethod)}</td>
                  <td className="px-5 py-4">{p?.paymentMethod === "online" ? (p?.transactionId || "-") : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
