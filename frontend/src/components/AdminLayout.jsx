import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  // Auto-open dropdown if on a page within that section
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/admin/products") || path.startsWith("/admin/add-product")) {
      setOpenDropdown("products");
    } else if (path.startsWith("/admin/categories") || path.startsWith("/admin/add-category") || path.includes("/admin/edit-category")) {
      setOpenDropdown("categories");
    }
  }, [location.pathname]);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const rawUser = localStorage.getItem("adminUser") || localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (!token || !user || user.role !== "admin") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login", { replace: true });
          return;
        }

        const res = await fetch(`${API_URL}/users/auth-check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login", { replace: true });
          return;
        }
        const data = await res.json();
        if (data?.role !== "admin") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login", { replace: true });
        }
      } catch (_error) {
        // Keep current admin session on transient network errors.
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAdmin();
  }, [API_URL, navigate]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } h-screen shrink-0 bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1
                className="text-xl font-bold"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                Admin Panel
              </h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/dashboard")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Products */}
            <li>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "products" ? null : "products")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive("/admin/products") || isActive("/admin/add-product")
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Products</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === "products" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
                {isSidebarOpen && openDropdown === "products" && (
                  <ul className="mt-2 ml-8 space-y-1">
                    <li>
                      <Link
                        to="/admin/add-product"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/add-product")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        Add Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/products"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/products") && !isActive("/admin/add-product")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        My Products
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* Categories */}
            <li>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "categories" ? null : "categories")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive("/admin/categories") || isActive("/admin/add-category")
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Categories</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === "categories" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
                {isSidebarOpen && openDropdown === "categories" && (
                  <ul className="mt-2 ml-8 space-y-1">
                    <li>
                      <Link
                        to="/admin/categories"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/categories") && !isActive("/admin/add-category")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        My Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/add-category"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/add-category")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        Add Category
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* Testimonials */}
            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/orders")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h10M7 16h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />
                </svg>
                {isSidebarOpen && <span>Orders</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/admin/payments"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/payments")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h.01M11 15h2m-8 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {isSidebarOpen && <span>Payments</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/admin/coupons"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/coupons")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3-1.12-3-2.5S10.343 3 12 3s3 1.12 3 2.5S13.657 8 12 8zM5 14a2 2 0 002-2V9a2 2 0 012-2h6a2 2 0 012 2v3a2 2 0 002 2h1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5h1z" />
                </svg>
                {isSidebarOpen && <span>Coupons</span>}
              </Link>
            </li>

            {/* Homepage */}
            <li>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "homepage" ? null : "homepage")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive("/admin/banners") || isActive("/admin/collections-showcase")
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                  </svg>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Homepage</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === "homepage" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                {isSidebarOpen && openDropdown === "homepage" && (
                  <ul className="mt-2 ml-8 space-y-1">
                    <li>
                      <Link
                        to="/admin/banners"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/banners")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        Banners
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/collections-showcase"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isActive("/admin/collections-showcase")
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        Shop By Collection
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li>
              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/users")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5V9a2 2 0 00-2-2h-3m0 13v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3m10 0H7m10 0a2 2 0 002-2v-3.5M7 20a2 2 0 01-2-2v-3.5M7 7a4 4 0 118 0 4 4 0 01-8 0zM3 7h2m0 0a3 3 0 013 3v.5M5 7a3 3 0 00-3 3v.5"
                  />
                </svg>
                {isSidebarOpen && <span>Users</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/admin/testimonials"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/testimonials")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {isSidebarOpen && <span>Testimonials</span>}
              </Link>
            </li>

            {/* Blog */}
            <li>
              <Link
                to="/admin/blogs"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/blogs")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13Z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h8" />
                </svg>
                {isSidebarOpen && <span>Blog</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout/Back to Site */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/30 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {isSidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 z-20 flex items-center justify-end gap-2 border-b bg-white px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:bg-gray-50"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            ← Back to Site
          </Link>
          <Link
            to="/admin/profile"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:bg-gray-50 ${
              isActive("/admin/profile") ? "bg-gray-100" : ""
            }`}
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin
          </Link>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
