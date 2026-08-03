import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatInr = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const AdminRevenue = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/orders/admin/revenue?year=${year}&month=${month}`,
        );
        const json = res.ok ? await res.json() : null;
        setData(json);
      } catch (error) {
        console.error("Error fetching revenue:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [year, month]);

  const summary = data?.summary || {
    totalRevenue: 0,
    paidRevenue: 0,
    unpaidRevenue: 0,
    refundableRevenue: 0,
    onlineRevenue: 0,
    cashRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
  };

  const daily = Array.isArray(data?.daily) ? data.daily : [];
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const maxDaily = Math.max(...daily.map((d) => d.revenue), 1);

  const shiftMonth = (delta) => {
    const date = new Date(year, month - 1 + delta, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Monthly Revenue
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {MONTHS[month - 1]} {year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition hover:bg-gray-50"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            ← Prev
          </button>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--brand-lavender-soft)" }}
          >
            {MONTHS.map((label, idx) => (
              <option key={label} value={idx + 1}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--brand-lavender-soft)" }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition hover:bg-gray-50"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            Next →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold" style={{ color: "var(--brand-dark)" }}>
                {formatInr(summary.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Orders</p>
              <p className="mt-2 text-3xl font-bold" style={{ color: "var(--brand-dark)" }}>
                {summary.orderCount}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Average Order Value</p>
              <p className="mt-2 text-3xl font-bold" style={{ color: "var(--brand-dark)" }}>
                {formatInr(summary.averageOrderValue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Paid Revenue</p>
              <p className="mt-2 text-3xl font-bold text-green-700">
                {formatInr(summary.paidRevenue)}
              </p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Unpaid</p>
              <p className="mt-1 text-xl font-semibold text-amber-600">
                {formatInr(summary.unpaidRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Refundable</p>
              <p className="mt-1 text-xl font-semibold text-rose-600">
                {formatInr(summary.refundableRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Online</p>
              <p className="mt-1 text-xl font-semibold" style={{ color: "var(--brand-dark)" }}>
                {formatInr(summary.onlineRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Cash</p>
              <p className="mt-1 text-xl font-semibold" style={{ color: "var(--brand-dark)" }}>
                {formatInr(summary.cashRevenue)}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">Daily Revenue</h3>
            <div className="flex h-48 items-end gap-1 overflow-x-auto pb-2">
              {daily.map((day) => {
                const height = Math.max(4, Math.round((day.revenue / maxDaily) * 160));
                return (
                  <div
                    key={day.day}
                    className="flex min-w-[18px] flex-1 flex-col items-center gap-1"
                    title={`${day.day} ${MONTHS[month - 1]}: ${formatInr(day.revenue)} (${day.orders} orders)`}
                  >
                    <div
                      className="w-full rounded-t"
                      style={{ height, background: "#3D294D", opacity: day.revenue ? 1 : 0.15 }}
                    />
                    <span className="text-[10px] text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Orders in {MONTHS[month - 1]} {year}
              </h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No orders found for this month.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="px-5 py-3">
                          <Link
                            to={`/admin/order-details/${order._id}`}
                            className="font-semibold hover:underline"
                            style={{ color: "#3D294D" }}
                          >
                            #{order.orderNumber || order._id?.slice(-6)}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800">
                            {order.customerName || "Customer"}
                          </div>
                          <div className="text-xs text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-5 py-3 capitalize text-gray-700">{order.status}</td>
                        <td className="px-5 py-3 capitalize text-gray-700">
                          {order.paymentStatus}
                          <span className="text-gray-400"> · {order.paymentMode}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">
                          {formatInr(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRevenue;
