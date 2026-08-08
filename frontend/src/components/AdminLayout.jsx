import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CubeIcon,
  BanknotesIcon,
  HomeIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  TicketIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
    if (p === "/admin/revenue") return "Revenue";
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
    if (p === "/admin/homepage-sections") return "Homepage Section Images";
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
  const isHomepageSections = path === "/admin/homepage-sections";

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
      currentPath.startsWith("/admin/edit-collection") ||
      currentPath.startsWith("/admin/homepage-sections")
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
    <div className="admin-theme flex h-full min-h-0 overflow-hidden bg-gray-50 text-sm">
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
            {isSidebarOpen ? (
              <XMarkIcon className="h-4 w-4" />
            ) : (
              <Bars3Icon className="h-4 w-4" />
            )}
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
                <HomeIcon className="h-5 w-5" />
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
                  <CubeIcon className="h-5 w-5" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Products</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "products" ? "rotate-180" : ""
                        }`}
                      />
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
                  <TagIcon className="h-5 w-5" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Categories</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "categories" ? "rotate-180" : ""
                        }`}
                      />
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
                <ClipboardDocumentListIcon className="h-5 w-5" />
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
                <CreditCardIcon className="h-5 w-5" />
                {isSidebarOpen && <span>Payments</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/admin/revenue"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive("/admin/revenue")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <BanknotesIcon className="h-5 w-5" />
                {isSidebarOpen && <span>Revenue</span>}
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
                <TicketIcon className="h-5 w-5" />
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
                    isBannerSection || isCollectionSection || isHomepageSections
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <PhotoIcon className="h-5 w-5" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Homepage</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === "homepage" ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>
                {isSidebarOpen && openDropdown === "homepage" && (
                  <ul className="mt-2 ml-8 space-y-1">
                    <li>
                      <Link
                        to="/admin/homepage-sections"
                        className={`block px-4 py-2 rounded-lg transition ${
                          isHomepageSections
                            ? "bg-purple-700 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        Section Images
                      </Link>
                    </li>
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
                <UsersIcon className="h-5 w-5" />
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
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
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
                <BookOpenIcon className="h-5 w-5" />
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
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="scrollbar-hide flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {pageTitle && (
          <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 sm:px-6">
            <h1
              className="text-sm font-medium"
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
                <UserCircleIcon className="h-4 w-4" />
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
