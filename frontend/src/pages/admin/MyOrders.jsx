import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openInvoiceWindow } from "../../utils/invoice";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeStatus = (s) => {
  if (s === "pending") return "confirm";
  if (s === "returnable") return "refundable";
  return s;
};

const prettyStatus = (s) => {
  const normalized = normalizeStatus(s || "");
  return normalized
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusBadgeClass = (status) => {
  const s = normalizeStatus(status);
  if (s === "confirm") return "bg-blue-100 text-blue-800";
  if (s === "processing") return "bg-yellow-100 text-yellow-800";
  if (s === "shipped") return "bg-purple-100 text-purple-800";
  if (s === "delivered") return "bg-green-100 text-green-800";
  if (s === "refundable") return "bg-teal-100 text-teal-800";
  if (s === "cancelled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");

  const [paymentStatus, setPaymentStatus] = useState("all"); // all | paid | unpaid | failed | refundable

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (orderStatus !== "all") params.set("orderStatus", orderStatus);
    if (paymentStatus !== "all") params.set("paymentStatus", paymentStatus);
    return params.toString();
  }, [startDate, endDate, orderStatus, paymentStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders/admin${queryString ? `?${queryString}` : ""}`);
      if (!res.ok) throw new Error("Failed to load admin orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // (Row-wise status dropdown removed per request; keeping filters only.)

  const sumQty = (o) => (o?.items || []).reduce((s, it) => s + (it?.quantity || 0), 0);
  const firstProductName = (o) => o?.items?.[0]?.product?.name || "Product";

  const downloadXls = () => {
    const header = ["Order ID", "Customer", "Products", "Qty", "Price", "Status", "Payment Status", "Date"];
    const lines = [
      header.join("\t"),
      ...(Array.isArray(orders) ? orders : []).map((o) => {
        const dateLabel = o?.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "";
        const productsLabel =
          o?.items?.length > 1 ? `${firstProductName(o)} +${o.items.length - 1} more` : firstProductName(o);

        return [
          `#${o.orderNumber || o._id.slice(-6)}`,
          o?.name || "Customer",
          productsLabel,
          String(sumQty(o)),
          String(o?.totalAmount || 0),
          prettyStatus(o?.status),
          o?.paymentStatus || "unpaid",
          dateLabel,
        ].join("\t");
      }),
    ];

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-orders.xls`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-medium mb-2" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Orders
        </h1>
        <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
          {orders.length} orders
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>START DATE</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>END DATE</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>ORDER STATUS</label>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}>
              <option value="all">All Status</option>
              <option value="confirm">Confirm</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold mb-2" style={{ color: "var(--brand-muted)" }}>PAYMENT STATUS</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
              <option value="refundable">Refundable</option>
            </select>
          </div>

          <div className="flex flex-col" style={{ justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={downloadXls}
              disabled={loading || orders.length === 0}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
              style={{ background: "#3D294D" }}
            >
              Download XLS
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="text-left px-5 py-4">Order ID</th>
              <th className="text-left px-5 py-4">Customer</th>
              <th className="text-left px-5 py-4">Products</th>
              <th className="text-left px-5 py-4">Qty</th>
              <th className="text-left px-5 py-4">Price</th>
              <th className="text-left px-5 py-4">Status</th>
              <th className="text-left px-5 py-4">Payment</th>
              <th className="text-left px-5 py-4">Date</th>
              <th className="text-left px-5 py-4">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={9} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>No orders found</td></tr>
            ) : (
              orders.map((o) => {
                const dateLabel = o?.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";
                return (
                  <tr
                    key={o._id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/order-details/${o._id}`)}
                  >
                    <td className="px-5 py-4 ">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/order-details/${o._id}`);
                        }}
                        className="text-left underline underline-offset-2 hover:opacity-90"
                        style={{ color: "var(--brand-dark)" }}
                      >
                        #{o.orderNumber || o._id.slice(-6)}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/order-details/${o._id}`);
                        }}
                        className="text-left hover:opacity-90"
                        style={{ color: "var(--brand-dark)" }}
                      >
                        <div className="font-semibold">{o.name || "Customer"}</div>
                        <div className="text-xs" style={{ color: "var(--brand-muted)" }}>{o.phone || o.email}</div>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <div className="font-semibold">{firstProductName(o)}</div>
                        {o.items?.length > 1 && <div className="text-xs" style={{ color: "var(--brand-muted)" }}>+{o.items.length - 1} more</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4">{sumQty(o)}</td>
                    <td className="px-5 py-4">₹{(o.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-0.5 text-[10px] font-semibold ${statusBadgeClass(o.status)}`}
                      >
                        {prettyStatus(o.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const ps = o.paymentStatus || "unpaid";
                        const badge =
                          ps === "paid"
                            ? "bg-green-100 text-green-800"
                            : ps === "failed"
                              ? "bg-red-100 text-red-800"
                              : ps === "refundable"
                                ? "bg-teal-100 text-teal-800"
                              : "bg-yellow-100 text-yellow-800";
                        return (
                          <span className={`rounded-full px-3 py-0.5 text-[10px] font-semibold ${badge}`}>
                            {ps}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4"><div className="text-xs" style={{ color: "var(--brand-muted)" }}>{dateLabel}</div></td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInvoiceWindow(o);
                        }}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                        style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                      >
                        Bill Invoice
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;

