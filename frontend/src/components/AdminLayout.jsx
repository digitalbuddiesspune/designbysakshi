import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_LOGO =
    "https://res.cloudinary.com/dbfooaz44/image/upload/v1775117601/Untitled_600_x_600_px_3_iujtam.png";
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

  const getAdminPageTitle = (pathname) => {
    const p = pathname.replace(/\/$/, "");
    if (p === "/admin/dashboard") return "Dashboard";
    if (p === "/admin/orders") return "My Orders";
    if (p.startsWith("/admin/order-details/")) return "Order Details";
    if (p === "/admin/payments") return "Payments";
    if (p === "/admin/coupons") return "Coupons";
    if (p === "/admin/add-coupon") return "Create Coupon";
    if (p === "/admin/users") return "Users";
    if (p === "/admin/profile") return "Admin Profile";
    if (p === "/admin/add-product") return "Add Product";
    if (p.startsWith("/admin/edit-product/")) return "Edit Product";
    if (p.startsWith("/admin/products/")) return "Product Details";
    if (p === "/admin/products") return "My Products";
    if (p === "/admin/categories") return "My Categories";
    if (p === "/admin/add-category") return "Add Category";
    if (p.startsWith("/admin/edit-category/")) return "Edit Category";
    if (p === "/admin/testimonials") return "Testimonials";
    if (p === "/admin/add-testimonial") return "Add Testimonial";
    if (p === "/admin/blogs") return "Blog";
    if (p === "/admin/banners") return "Banners";
    if (p === "/admin/add-banner") return "Add Banner";
    if (p.startsWith("/admin/edit-banner/")) return "Edit Banner";
    if (p === "/admin/collections-showcase") return "Shop By Collection";
    if (p === "/admin/add-collection") return "Add Collection";
    if (p.startsWith("/admin/edit-collection/")) return "Edit Collection";
    return "";
  };

  const pageTitle = getAdminPageTitle(location.pathname);
  const path = location.pathname;
  const isBannerSection =
    path === "/admin/banners" || path.startsWith("/admin/add-banner") || path.startsWith("/admin/edit-banner");
  const isCollectionSection =
    path === "/admin/collections-showcase" ||
    path.startsWith("/admin/add-collection") ||
    path.startsWith("/admin/edit-collection");

  // Auto-open dropdown if on a page within that section
  useEffect(() => {
    const currentPath = location.pathname;
    if (
      currentPath.startsWith("/admin/products") ||
      currentPath.startsWith("/admin/add-product") ||
      currentPath.startsWith("/admin/edit-product")
    ) {
      setOpenDropdown("products");
    } else if (
      currentPath.startsWith("/admin/categories") ||
      currentPath.startsWith("/admin/add-category") ||
      currentPath.includes("/admin/edit-category")
    ) {
      setOpenDropdown("categories");
    } else if (
      currentPath.startsWith("/admin/banners") ||
      currentPath.startsWith("/admin/add-banner") ||
      currentPath.startsWith("/admin/edit-banner") ||
      currentPath.startsWith("/admin/collections-showcase") ||
      currentPath.startsWith("/admin/add-collection") ||
      currentPath.startsWith("/admin/edit-collection")
    ) {
      setOpenDropdown("homepage");
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
    <div className="admin-theme flex h-full min-h-0 overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } scrollbar-hide h-full min-h-0 shrink-0 bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Brand logo */}
        <div
          className={`border-b border-gray-700 ${
            isSidebarOpen ? "relative p-4" : "relative px-2 py-3"
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex min-w-0 items-center gap-2 pr-8">
              <img
                src={ADMIN_LOGO}
                alt="Designs By Sakshi"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <p
                className="min-w-0 truncate text-lg leading-tight text-white"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 600 }}
              >
                Designs By Sakshi
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center pt-1">
              <span
                className="text-2xl font-bold leading-none text-white"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                aria-label="Designs By Sakshi"
              >
                D
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`shrink-0 rounded p-1 transition hover:bg-gray-800 ${
              isSidebarOpen ? "absolute right-2 top-2" : "absolute right-1 top-1"
            }`}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
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
                    isBannerSection || isCollectionSection
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
                          isBannerSection
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
                          isCollectionSection
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

        {/* Logout */}
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="scrollbar-hide flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {pageTitle && (
          <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 sm:px-6">
            <h1
              className="text-xl font-medium sm:text-2xl"
              style={{
                color: "var(--brand-dark)",
                fontFamily: "Cormorant Garamond, Georgia, serif",
              }}
            >
              {pageTitle}
            </h1>
            <div className="flex flex-wrap items-center justify-end gap-2">
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
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
