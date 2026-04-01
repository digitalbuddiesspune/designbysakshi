import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const DynamicCollectionsDropdown = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/collection-showcase`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);
  return (
    <div
      className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
      style={{ borderColor: "var(--brand-lavender-soft)", zIndex: 99999 }}
    >
      {items.map((item) => (
        <Link
          key={item._id}
          to={item.route || "#"}
          className="block px-4 py-2 text-sm no-underline transition hover:bg-gray-50"
          style={{ color: "var(--brand-dark)" }}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

const Header = () => {
  const [clickedCategory, setClickedCategory] = useState(null);
  const [desktopDropdownLeft, setDesktopDropdownLeft] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showCatalogPopup, setShowCatalogPopup] = useState(false);
  const [categoryBar, setCategoryBar] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const categoryRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const catalogPopupRef = useRef(null);

  const isLoggedIn = () => {
    // Use localStorage directly so the UI stays correct even if `user` state is stale.
    try {
      return Boolean(localStorage.getItem("user"));
    } catch {
      return false;
    }
  };

  const openAuthModal = (type = "login") => {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: { type },
      }),
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleAuthChanged = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("auth-changed", handleAuthChanged);
    return () => window.removeEventListener("auth-changed", handleAuthChanged);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  useEffect(() => {
    const guestId = getGuestId();
    if (guestId) {
      fetchCartCount(guestId);
      fetchWishlistCount(guestId);
    }
  }, []);

  useEffect(() => {
    const handleCartUpdated = () => {
      const guestId = getGuestId();
      if (guestId) fetchCartCount(guestId);
    };
    const handleWishlistUpdated = () => {
      const guestId = getGuestId();
      if (guestId) fetchWishlistCount(guestId);
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("wishlist-updated", handleWishlistUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
    };
  }, []);

  const fetchCartCount = async (guestId) => {
    try {
      const res = await fetch(`${API_URL}/cart?guestId=${encodeURIComponent(guestId)}`);
      const data = await res.json();
      const items = data?.items || [];
      const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  const fetchWishlistCount = async (guestId) => {
    try {
      const res = await fetch(`${API_URL}/wishlist?guestId=${encodeURIComponent(guestId)}`);
      const data = await res.json();
      const products = data?.products || [];
      setWishlistCount(products.length);
    } catch (err) {
      console.error("Error fetching wishlist count:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setClickedCategory(null);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (catalogPopupRef.current && !catalogPopupRef.current.contains(event.target)) {
        setShowCatalogPopup(false);
      }
    };

    if (clickedCategory || showUserDropdown || showMobileMenu || showCatalogPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedCategory, showUserDropdown, showMobileMenu, showCatalogPopup]);

  // Close logout toast after 3 seconds
  useEffect(() => {
    if (showLogoutToast) {
      const timer = setTimeout(() => {
        setShowLogoutToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutToast]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const categories = await response.json();

      // Transform backend categories to match frontend structure
      const transformedCategories = categories.map((cat) => ({
        label: cat.name,
        slug: cat.slug,
        sub: (cat.subcategories || []).map((sub) => ({
          label: sub.name,
          slug: sub.slug,
        })),
      }));

      // Also merge in collection-showcase items under latest-collection,
      // so navbar reflects configured collections even if category data wasn't updated yet.
      try {
        const csRes = await fetch(`${API_URL}/collection-showcase`);
        const cs = await csRes.json();
        const items = Array.isArray(cs) ? cs : [];
        if (items.length > 0) {
          const latestIdx = transformedCategories.findIndex((c) => c.slug === "latest-collection");
          if (latestIdx !== -1) {
            const existing = new Map(
              transformedCategories[latestIdx].sub.map((s) => [String(s.slug).toLowerCase(), s]),
            );
            // Preserve API order (already priority-sorted)
            for (const it of items) {
              const slug = String((it.route || "").split("/").pop() || "").toLowerCase();
              const title = it.title || slug.replace(/-/g, " ");
              if (slug && !existing.has(slug)) {
                existing.set(slug, { label: title, slug });
              }
            }
            transformedCategories[latestIdx].sub = Array.from(existing.values());
          }
        }
      } catch {
        // ignore merge errors silently
      }

      setCategoryBar(transformedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const subHref = (catSlug, subSlug) => {
    if (catSlug === "latest-collection") {
      // Always route to /latest-collection/<slug> for latest collection items
      return `/latest-collection/${subSlug}`;
    }
    return `/${catSlug}?subcategory=${subSlug}`;
  };
  const mainHref = (slug) => `/${slug}`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserDropdown(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const selectedDesktopCategory = categoryBar.find((c) => c.slug === clickedCategory);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[2000] w-full border-b"
      style={{
        background: "#845183",
        borderColor: "rgba(91, 71, 109, 0.22)",
      }}
    >
      {/* Mobile Header */}
      <div className="lg:hidden mx-auto relative flex h-16 items-center justify-between px-4">
        {/* Left side: Hamburger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 transition hover:opacity-80"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Logo - Center (absolute so it stays in middle) */}
        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 no-underline transition opacity-90 hover:opacity-100"
        >
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774441947/Screenshot_2026-03-25_174920-removebg-preview_5_gwltrx.png"
            alt="DesignBy Sakshi"
            className="h-10 lg:h-[22px] w-auto object-contain"
          />
        </Link>

        {/* Right side icons */}
        <div className="flex items-center gap-2" style={{ color: "#ffffff" }}>
          {/* Search Icon */}
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 transition hover:opacity-80"
            aria-label="Search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex mx-auto h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 md:h-24">
        <Link
          to="/"
          className="flex items-center gap-1 no-underline transition opacity-90 hover:opacity-100"
          style={{ color: "#ffffff" }}
        >
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774441947/Screenshot_2026-03-25_174920-removebg-preview_5_gwltrx.png"
            alt="DesignBy Sakshi"
            className="h-22 w-22 object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6" aria-label="Main">
          {/* Search Bar - First */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--brand-lavender-soft)",
                    color: "#ffffff",
                    minWidth: "200px"
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded p-2 transition hover:opacity-80"
                  aria-label="Search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="rounded p-2 transition hover:opacity-80"
                  aria-label="Close search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="rounded p-2 transition hover:opacity-80"
                aria-label="Search"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* About Us */}
          <Link
            to="/about"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "#ffffff" }}
          >
            About Us
          </Link>

          {/* Latest Collection dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="text-base font-medium transition hover:opacity-90 sm:text-lg flex items-center gap-1 bg-transparent border-none cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              Collections
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <DynamicCollectionsDropdown />
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "#ffffff" }}
          >
            Contact
          </Link>

          {/* Blog */}
          <Link
            to="/blog"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "#ffffff" }}
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-4" style={{ color: "#ffffff" }}>
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative rounded p-2 no-underline transition hover:opacity-80"
            aria-label="Wishlist"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span
                className="absolute top-[-2px] right-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-white text-sm font-bold text-black shadow"
                style={{ lineHeight: 1 }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Icon */}
          <Link
            to="/cart"
            className="relative rounded p-2 no-underline transition hover:opacity-80"
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute top-[-2px] right-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-white text-sm font-bold text-black shadow"
                style={{ lineHeight: 1 }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Icon with Dropdown */}
          <div className="relative" ref={userDropdownRef} style={{ zIndex: 99999 }}>
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn()) {
                  setShowUserDropdown(!showUserDropdown);
                } else {
                  openAuthModal("login");
                }
              }}
              className="rounded p-2 transition hover:opacity-80"
              aria-label="User"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {isLoggedIn() && showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  zIndex: 99999,
                }}
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition hover:bg-gray-50"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setShowUserDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition hover:bg-gray-50"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    My Orders
                  </button>
                  <div className="border-t" style={{ borderColor: "var(--brand-lavender-soft)" }}></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm transition hover:bg-gray-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Below Header */}
      {showSearch && (
        <div
          className="lg:hidden border-b px-4 py-3"
          style={{
            borderColor: "rgba(91, 71, 109, 0.22)",
            background: "linear-gradient(180deg, #c5a2d7 0%, #dcc7e6 58%, #ffffff 100%)",
          }}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--brand-lavender-soft)",
                color: "var(--brand-dark)",
              }}
              autoFocus
            />
            <button
              type="submit"
              className="p-2 transition hover:opacity-80 rounded"
              aria-label="Search"
              style={{ background: "#3D294D", color: "white" }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="p-2 transition hover:opacity-80"
              aria-label="Close search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#ffffff" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] border-t pb-[max(env(safe-area-inset-bottom),6px)]"
        style={{
          borderColor: "rgba(212, 200, 228, 0.9)",
          background: "#ffffff",
        }}
      >
          <div className="flex items-center justify-between px-2 py-1">
            {/* Home */}
            <button
              type="button"
              onClick={() => {
                setShowCatalogPopup(false);
                setShowMobileMenu(false);
                navigate("/");
              }}
              className="flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition"
              aria-label="Home"
              style={{
                color: location.pathname === "/" ? "#3D294D" : "var(--brand-dark)",
                background: location.pathname === "/" ? "rgba(92,75,107,0.12)" : "transparent",
              }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 9.5L12 3l9 6.5V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.5z" />
              </svg>
              <span className="text-[11px] font-bold">Home</span>
            </button>

            {/* Catalog */}
            <button
              type="button"
              onClick={() => {
                setShowMobileMenu(false);
                setShowCatalogPopup((prev) => !prev);
              }}
              className="flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition"
              aria-label="Catalog"
              style={{
                color: showCatalogPopup ? "#3D294D" : "var(--brand-dark)",
                background: showCatalogPopup ? "rgba(92,75,107,0.12)" : "transparent",
              }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7.5h16M4 12h16M4 16.5h16" />
              </svg>
              <span className="text-[11px] font-bold">Catalog</span>
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                setShowCatalogPopup(false);
                navigate("/cart");
              }}
              className="relative flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition"
              aria-label="Cart"
              style={{
                color: location.pathname.startsWith("/cart") ? "#3D294D" : "var(--brand-dark)",
                background: location.pathname.startsWith("/cart") ? "rgba(92,75,107,0.12)" : "transparent",
              }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute right-2 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3D294D] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
              <span className="text-[11px] font-bold">Cart</span>
            </button>

            {/* My Orders */}
            <button
              type="button"
              onClick={() => {
                setShowCatalogPopup(false);
              if (isLoggedIn()) {
                  navigate("/orders");
                } else {
                  openAuthModal("login");
                }
              }}
              className="flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition"
              aria-label="My Orders"
              style={{
                color: location.pathname.startsWith("/orders") ? "#3D294D" : "var(--brand-dark)",
                background: location.pathname.startsWith("/orders") ? "rgba(92,75,107,0.12)" : "transparent",
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7h8M8 12h8M8 17h5M5.5 4h13A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5v-13A1.5 1.5 0 015.5 4z" />
                </svg>
              </span>
              <span className="text-[11px] font-bold">Orders</span>
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => {
                setShowCatalogPopup(false);
                if (isLoggedIn()) {
                  navigate("/profile");
                } else {
                  openAuthModal("login");
                }
              }}
              className="flex min-w-[70px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition"
              aria-label="Profile"
              style={{
                color: location.pathname.startsWith("/profile") ? "#3D294D" : "var(--brand-dark)",
                background: location.pathname.startsWith("/profile") ? "rgba(92,75,107,0.12)" : "transparent",
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="text-[11px] font-bold">Profile</span>
            </button>
          </div>
      </div>

      {/* Catalog popup (small box) */}
      {showCatalogPopup && (
        <div
          ref={catalogPopupRef}
          className="lg:hidden fixed bottom-[76px] left-0 right-0 z-[1001] w-full rounded-t-lg border bg-white shadow-lg overflow-hidden"
          style={{ borderColor: "var(--brand-lavender-soft)" }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Catalog</p>
            <button
              type="button"
              onClick={() => setShowCatalogPopup(false)}
              className="p-2 transition hover:opacity-80"
              aria-label="Close catalog"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-2 space-y-1">
            {categoryBar.map((cat) => {
              const isExpanded = expandedMobileCategory === cat.slug;
              return (
                <div key={cat.slug} className="rounded-md hover:bg-gray-50">
                  {cat.sub.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.slug)}
                        className="w-full flex items-center justify-between px-2 py-2 text-left"
                        style={{ color: "var(--brand-dark)" }}
                      >
                        <span className="text-sm font-semibold">{cat.label}</span>
                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-muted)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="pl-3 pb-2 space-y-1">
                          {cat.sub.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={subHref(cat.slug, sub.slug)}
                              onClick={() => {
                                setShowCatalogPopup(false);
                                setExpandedMobileCategory(null);
                              }}
                              className="block px-2 py-1 text-sm font-medium no-underline"
                              style={{ color: "var(--brand-muted)" }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={mainHref(cat.slug)}
                      onClick={() => setShowCatalogPopup(false)}
                      className="block px-2 py-2 text-sm font-semibold no-underline"
                      style={{ color: "var(--brand-dark)" }}
                    >
                      {cat.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logout Toast Notification */}
      {showLogoutToast && (
        <div
          className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in"
          style={{
            backgroundColor: "#000000",
            color: "var(--brand-lavender)",
          }}
        >
          <p className="text-sm font-medium">You are logout</p>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 100000 }}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 transition hover:opacity-80"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* User Info */}
              {user && (
                <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                  <p className="text-sm mb-3 font-semibold" style={{ color: "var(--brand-muted)" }}>
                    {user.name}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMobileMenu(false);
                      }}
                      className="text-base font-semibold block"
                      style={{ color: "var(--brand-dark)" }}
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setShowMobileMenu(false);
                      }}
                      className="text-base font-semibold block"
                      style={{ color: "var(--brand-dark)" }}
                    >
                      My Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleLogout();
                      }}
                      className="text-base font-semibold block text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                <Link
                  to="/about"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Contact
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Blog
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-800">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Cart
                </Link>
              </div>

              {/* Collections */}
              <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--brand-muted)" }}>Collections</p>
                {[
                  { label: "Wedding Collection", path: "/wedding-collection" },
                  { label: "Festive Collection", path: "/festive-collection" },
                  { label: "Partywear Collection", path: "/partywear-collection" },
                  { label: "Daily Wear Collection", path: "/dailywear-collection" },
                  { label: "Office Wear Collection", path: "/officewear-collection" },
                  { label: "Luxury AD Collection", path: "/luxuryad-collection" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className="block py-2 text-sm font-medium no-underline"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Catalog Heading */}
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "var(--brand-dark)",
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                }}
              >
                Catalog
              </h3>

              {/* Categories with Accordion */}
              <div className="space-y-1">
                {categoryBar.map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.slug;
                  return (
                    <div key={cat.slug} className="border-b" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                      {cat.sub.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedMobileCategory(isExpanded ? null : cat.slug);
                            }}
                            className="w-full flex items-center justify-between py-3 text-left text-base font-semibold"
                            style={{ color: "var(--brand-dark)" }}
                          >
                            <span>{cat.label}</span>
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                          </button>
                          {isExpanded && (
                            <div className="pl-4 pb-2">
                              {cat.sub.map((sub) => (
                                <Link
                                  key={sub.slug}
                                  to={subHref(cat.slug, sub.slug)}
                                  onClick={() => setShowMobileMenu(false)}
                                  className="block py-2 text-sm font-medium"
                                  style={{ color: "var(--brand-muted)" }}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={mainHref(cat.slug)}
                          onClick={() => setShowMobileMenu(false)}
                          className="block py-3 text-base font-semibold"
                          style={{ color: "var(--brand-dark)" }}
                        >
                          {cat.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category bar: main categories with subcategories - Desktop Only */}
      <div
        ref={categoryRef}
        className="hidden md:block border-t relative category-dropdown-container"
        style={{ borderColor: "var(--brand-lavender-soft)", background: "#000000", zIndex: 2001, overflow: 'visible' }}
      >
        <div className="w-full px-2 sm:px-4 no-scrollbar" style={{ overflowX: 'auto', overflowY: 'visible', position: 'relative' }}>
          <nav
            className="flex w-max min-w-full flex-nowrap items-center justify-start gap-4 py-1.5 md:py-2 relative"
            aria-label="Categories"
          >
            {categoryBar.map((cat) => {
              const isOpen = clickedCategory === cat.slug;
              return (
                <div
                  key={cat.slug}
                  className="relative flex-none text-center"
                  style={{ position: 'relative', zIndex: isOpen ? 100000 : 'auto' }}
                >
                  {/* Main category: click toggles dropdown or navigates if no subcategories */}
                  <div className="flex items-center justify-center px-2 relative">
                    {cat.sub.length > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (clickedCategory === cat.slug) {
                            setClickedCategory(null);
                            setDesktopDropdownLeft(null);
                          } else {
                            // Close any other open dropdowns first
                            setClickedCategory(cat.slug);
                            const navContainerRect = categoryRef.current?.getBoundingClientRect();
                            const triggerRect = e.currentTarget.getBoundingClientRect();
                            if (navContainerRect) {
                              setDesktopDropdownLeft(
                                triggerRect.left - navContainerRect.left + triggerRect.width / 2,
                              );
                            }
                          }
                        }}
                        className="py-1.5 text-sm font-medium transition hover:opacity-90 whitespace-nowrap bg-transparent border-none cursor-pointer"
                        style={{ color: "#ffffff" }}
                      >
                        {cat.label}
                        <svg
                          className={`inline-block ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
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
                      </button>
                    ) : (
                      <>
                        {cat.slug === "latest-collection" ? (
                          <span
                            className="py-1.5 text-sm font-medium whitespace-nowrap cursor-default opacity-70"
                            style={{ color: "#ffffff" }}
                            aria-disabled="true"
                          >
                            {cat.label}
                          </span>
                        ) : (
                          <Link
                            to={mainHref(cat.slug)}
                            className="py-1.5 text-sm font-medium no-underline transition hover:opacity-90 whitespace-nowrap"
                            style={{ color: "#ffffff" }}
                          >
                            {cat.label}
                          </Link>
                        )}
                      </>
                    )}

                    {/* Dropdown: visible only when clicked */}
                    {false && cat.sub.length > 0 && (
                      <div
                        className={`category-dropdown absolute rounded-md border bg-white py-2 shadow-lg ${isOpen ? '' : 'hidden'
                          }`}
                        style={{
                          borderColor: "var(--brand-lavender-soft)",
                          zIndex: 3000,
                          position: 'absolute',
                          display: isOpen ? 'block' : 'none',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '180px',
                          whiteSpace: 'nowrap',
                          marginTop: '4px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cat.sub.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={subHref(cat.slug, sub.slug)}
                            className="block px-4 py-2 text-sm no-underline transition hover:opacity-90 hover:bg-gray-50"
                            style={{ color: "var(--brand-dark)" }}
                            onClick={() => {
                              setClickedCategory(null);
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
        {selectedDesktopCategory?.sub?.length > 0 && (
          <div
            className="absolute top-full mt-1 -translate-x-[42%] rounded-md border bg-white py-2 shadow-lg"
            style={{
              left: desktopDropdownLeft != null ? `${Math.max(desktopDropdownLeft, 110)}px` : "50%",
              borderColor: "var(--brand-lavender-soft)",
              zIndex: 4000,
              minWidth: "220px",
              whiteSpace: "nowrap",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedDesktopCategory.sub.map((sub) => (
              <Link
                key={sub.slug}
                to={subHref(selectedDesktopCategory.slug, sub.slug)}
                className="block px-4 py-2 text-sm no-underline transition hover:opacity-90 hover:bg-gray-50"
                style={{ color: "var(--brand-dark)" }}
                onClick={() => setClickedCategory(null)}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
