import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    todayOrders: 0,
    todayPending: 0,
    todayDelivered: 0,
    todayCanceled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSalesData();
  }, [selectedYear]);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/orders/admin`),
      ]);

      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      const today = new Date();
      const isToday = (v) => {
        const d = new Date(v);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      };

      const todayOrders = (Array.isArray(orders) ? orders : []).filter((o) => isToday(o.createdAt));
      const pendingStatuses = new Set(["pending", "confirm", "processing", "shipped", "shipping"]);
      const todayPending = todayOrders.filter((o) =>
        pendingStatuses.has((o.status || "").toLowerCase()),
      ).length;
      const todayDelivered = todayOrders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;
      const todayCanceled = todayOrders.filter((o) => (o.status || "").toLowerCase() === "cancelled").length;

      const todaysPlaced = todayOrders
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
      setRecentOrders(todaysPlaced);

      setStats({
        totalProducts: products.length || 0,
        totalCategories: categories.length || 0,
        todayOrders: todayOrders.length,
        todayPending,
        todayDelivered,
        todayCanceled,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const emptySales = months.map((month) => ({ month, sales: 0 }));
    setSalesData(emptySales);
    try {
      const res = await fetch(`${API_URL}/orders/admin`);
      const orders = res.ok ? await res.json() : [];
      const monthlyTotals = Array(12).fill(0);
      const monthlyLastDate = Array(12).fill(null);

      (Array.isArray(orders) ? orders : []).forEach((order) => {
        if (!order?.createdAt) return;
        const status = String(order.status || "").toLowerCase();
        // Cancelled orders should not contribute to revenue chart.
        if (status === "cancelled") return;
        const createdAt = new Date(order.createdAt);
        if (createdAt.getFullYear() !== selectedYear) return;
        const monthIndex = createdAt.getMonth();
        monthlyTotals[monthIndex] += Number(order.totalAmount || 0);
        const existing = monthlyLastDate[monthIndex];
        if (!existing || createdAt > existing) {
          monthlyLastDate[monthIndex] = createdAt;
        }
      });

      setSalesData(
        months.map((month, index) => ({
          month,
          sales: monthlyTotals[index],
          monthIndex: index,
          lastOrderDate: monthlyLastDate[index],
        })),
      );
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData(emptySales);
    }
  };

  const chartSalesData = salesData;
  const maxSales = Math.max(...chartSalesData.map((d) => d.sales), 1);
  const chartHeight = 300;
  const chartWidth = 620;
  const barWidth = chartSalesData.length > 0 ? chartWidth / chartSalesData.length - 10 : 0;
  const firstProductName = (o) => o?.items?.[0]?.product?.name || "Product";

  return (
    <div className="p-6 sm:p-8">
      <h1
        className="mb-8 text-3xl font-medium"
        style={{
          color: "var(--brand-dark)",
          fontFamily: "Cormorant Garamond, Georgia, serif",
        }}
      >
        Dashboard
      </h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          {/* Today's Orders Section */}
          <div className="mb-8">
           
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Orders</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: "var(--brand-dark)" }}>
                      {stats.todayOrders}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-full"
                    style={{ background: "var(--brand-lavender-soft)" }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Pending</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: "#f59e0b" }}>
                      {stats.todayPending}
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-yellow-100">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Delivered</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: "#10b981" }}>
                      {stats.todayDelivered}
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-green-100">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Canceled</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: "#ef4444" }}>
                      {stats.todayCanceled}
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-red-100">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Totals (moved above graph) */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: "var(--brand-dark)" }}>
                    {stats.totalProducts}
                  </p>
                </div>
                <div
                  className="p-4 rounded-full"
                  style={{ background: "var(--brand-lavender-soft)" }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <Link
                to="/admin/products"
                className="mt-4 inline-block text-sm font-medium"
                style={{ color: "var(--brand-purple)" }}
              >
                View All →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Categories</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: "var(--brand-dark)" }}>
                    {stats.totalCategories}
                  </p>
                </div>
                <div
                  className="p-4 rounded-full"
                  style={{ background: "var(--brand-lavender-soft)" }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
              <Link
                to="/admin/categories"
                className="mt-4 inline-block text-sm font-medium"
                style={{ color: "var(--brand-purple)" }}
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Sales Chart Section */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "var(--brand-dark)" }}>
                Monthly Sales
              </h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <svg width={chartWidth} height={chartHeight + 50} className="mx-auto">
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <g key={ratio}>
                    <line
                      x1="40"
                      y1={chartHeight - ratio * chartHeight + 20}
                      x2={chartWidth}
                      y2={chartHeight - ratio * chartHeight + 20}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <text
                      x="35"
                      y={chartHeight - ratio * chartHeight + 25}
                      textAnchor="end"
                      className="text-xs fill-gray-600"
                    >
                      {Math.round(maxSales * ratio).toLocaleString()}
                    </text>
                  </g>
                ))}
                {/* Bars */}
                {chartSalesData.map((data, index) => {
                  const barHeight = (data.sales / maxSales) * chartHeight;
                  const x = 50 + index * (barWidth + 10);
                  const y = chartHeight - barHeight + 20;
                  const hoverDate = data.lastOrderDate
                    ? new Date(data.lastOrderDate).toLocaleDateString("en-IN")
                    : `${data.month} ${selectedYear}`;
                  return (
                    <g key={data.month}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="url(#gradient)"
                        rx="4"
                      >
                        <title>{`${data.month} ${selectedYear}\nSales: ₹${data.sales.toLocaleString("en-IN")}\nLast order date: ${hoverDate}`}</title>
                      </rect>
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight + 40}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                      >
                        {data.month}
                      </text>
                      <text
                        x={x + barWidth / 2}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-xs fill-gray-800 font-semibold"
                      >
                        {data.sales.toLocaleString()}
                      </text>
                    </g>
                  );
                })}
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Recent Today's Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--brand-dark)" }}>
              Recent Today's Placed Orders
            </h2>
            {recentOrders.length === 0 ? (
              <div className="text-sm" style={{ color: "var(--brand-muted)" }}>
                No orders placed today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                      <th className="text-left px-3 py-2">Order ID</th>
                      <th className="text-left px-3 py-2">Customer</th>
                      <th className="text-left px-3 py-2">Product</th>
                      <th className="text-left px-3 py-2">Qty</th>
                      <th className="text-left px-3 py-2">Amount</th>
                      <th className="text-left px-3 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o._id} className="border-t">
                        <td className="px-3 py-2" style={{ color: "var(--brand-dark)" }}>
                          #{o.orderNumber || o._id?.slice(-6)}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--brand-dark)" }}>
                          {o.name || "Customer"}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--brand-dark)" }}>
                          {firstProductName(o)}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--brand-dark)" }}>
                          {(o.items || []).reduce((s, it) => s + (it.quantity || 0), 0)}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--brand-dark)" }}>
                          ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--brand-muted)" }}>
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
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

export default Dashboard;
