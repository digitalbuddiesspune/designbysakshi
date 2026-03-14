import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

  useEffect(() => {
    fetchStats();
    fetchSalesData();
  }, [selectedYear]);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
      ]);

      const products = await productsRes.json();
      const categories = await categoriesRes.json();

      // Mock order data - replace with actual API when ready
      const today = new Date().toISOString().split("T")[0];
      const mockOrders = [
        { date: today, status: "pending" },
        { date: today, status: "delivered" },
        { date: today, status: "delivered" },
        { date: today, status: "canceled" },
      ];

      const todayOrders = mockOrders.filter((o) => o.date === today);
      const todayPending = todayOrders.filter((o) => o.status === "pending").length;
      const todayDelivered = todayOrders.filter((o) => o.status === "delivered").length;
      const todayCanceled = todayOrders.filter((o) => o.status === "canceled").length;

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

  const fetchSalesData = () => {
    // Mock sales data - replace with actual API when ready
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
    const mockSales = months.map((month, index) => ({
      month,
      sales: Math.floor(Math.random() * 50000) + 10000,
    }));
    setSalesData(mockSales);
  };

  const maxSales = Math.max(...salesData.map((d) => d.sales), 1);
  const chartHeight = 300;
  const chartWidth = 800;
  const barWidth = chartWidth / salesData.length - 10;

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
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--brand-dark)" }}>
              Today's Orders
            </h2>
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
                {salesData.map((data, index) => {
                  const barHeight = (data.sales / maxSales) * chartHeight;
                  const x = 50 + index * (barWidth + 10);
                  const y = chartHeight - barHeight + 20;
                  return (
                    <g key={data.month}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="url(#gradient)"
                        rx="4"
                      />
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

          {/* Other Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm mb-4">Quick Actions</p>
              <div className="space-y-3">
                <Link
                  to="/admin/add-product"
                  className="block w-full px-4 py-2 text-sm font-semibold text-white rounded-lg transition"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                  }}
                >
                  Add New Product
                </Link>
                <Link
                  to="/admin/add-category"
                  className="block w-full px-4 py-2 text-sm font-semibold text-white rounded-lg transition"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                  }}
                >
                  Add New Category
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
