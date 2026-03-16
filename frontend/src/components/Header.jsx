import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Header = () => {
  const [clickedCategory, setClickedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [categoryBar, setCategoryBar] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const categoryRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
    };

    if (clickedCategory || showUserDropdown || showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedCategory, showUserDropdown, showMobileMenu]);

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

      setCategoryBar(transformedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const subHref = (catSlug, subSlug) => `/${catSlug}?subcategory=${subSlug}`;
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
    setUser(null);
    setShowUserDropdown(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <header
      className="sticky top-0 z-[100] w-full border-b"
      style={{ background: "var(--brand-pastel)", borderColor: "var(--brand-lavender-soft)" }}
    >
      {/* Mobile Header */}
      <div className="md:hidden mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Hamburger and Logo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 transition hover:opacity-80"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo - On the left */}
          <Link
            to="/"
            className="flex items-center gap-1 no-underline transition opacity-90 hover:opacity-100"
            style={{ color: "var(--brand-dark)" }}
          >
            <span
              className="text-xl font-semibold tracking-wide"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              DesignBy
            </span>
            <span
              className="text-2xl"
              style={{ fontFamily: "Great Vibes, Georgia, cursive" }}
            >
              Sakshi
            </span>
          </Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2" style={{ color: "var(--brand-dark)" }}>
          {/* Search Icon */}
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 transition hover:opacity-80"
            aria-label="Search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative rounded p-2 no-underline transition hover:opacity-80"
            aria-label="Wishlist"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span
                className="absolute top-[-6px] right-[-6px] flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs font-semibold text-black shadow"
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
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute  top-[-6px] right-[-6px] flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black shadow"
                style={{ lineHeight: 1 }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User/Logout Icon */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 transition hover:opacity-80"
              aria-label="Logout"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="p-2 transition hover:opacity-80"
              aria-label="Login"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex mx-auto h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 md:h-24">
        <Link
          to="/"
          className="flex items-center gap-1 no-underline transition opacity-90 hover:opacity-100"
          style={{ color: "var(--brand-dark)" }}
        >
          <span
            className="text-2xl font-semibold tracking-wide sm:text-3xl"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            DesignBy
          </span>
          <span
            className="text-3xl sm:text-4xl"
            style={{ fontFamily: "Great Vibes, Georgia, cursive" }}
          >
            Sakshi
          </span>
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
                    color: "var(--brand-dark)",
                    minWidth: "200px"
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded p-2 transition hover:opacity-80"
                  aria-label="Search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* About Us */}
          <Link
            to="/about"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            About Us
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4" style={{ color: "var(--brand-dark)" }}>
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative rounded p-2 no-underline transition hover:opacity-80"
            aria-label="Wishlist"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span
                className="absolute top-[-4px] right-[-2px] flex h-5 w-5 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow"
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
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute top-[-4px] right-[-2px] flex h-5 w-5 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow"
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
                if (user) {
                  setShowUserDropdown(!showUserDropdown);
                } else {
                  navigate("/login");
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
            {user && showUserDropdown && (
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
        <div className="md:hidden border-b px-4 py-3" style={{ borderColor: "var(--brand-lavender-soft)", background: "var(--brand-pastel)" }}>
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
              style={{ background: "var(--brand-lavender)", color: "white" }}
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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--brand-dark)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
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
                  to="/wishlist"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-base font-semibold"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Wishlist
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
        style={{ borderColor: "var(--brand-lavender-soft)", background: "#000000", zIndex: 100, overflow: 'visible' }}
      >
        <div className="w-full px-2 sm:px-4 category-dropdown-container" style={{ overflowX: 'auto', overflowY: 'visible', position: 'relative' }}>
          <nav
            className="flex flex-nowrap items-center justify-between gap-4 w-full py-1.5 md:py-2 relative category-dropdown-container"
            aria-label="Categories"
          >
            {categoryBar.map((cat) => {
              const isOpen = clickedCategory === cat.slug;
              return (
                <div
                  key={cat.slug}
                  className="relative flex-1 text-center"
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
                          } else {
                            // Close any other open dropdowns first
                            setClickedCategory(cat.slug);
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
                      <Link
                        to={mainHref(cat.slug)}
                        className="py-1.5 text-sm font-medium no-underline transition hover:opacity-90 whitespace-nowrap"
                        style={{ color: "#ffffff" }}
                      >
                        {cat.label}
                      </Link>
                    )}

                    {/* Dropdown: visible only when clicked */}
                    {cat.sub.length > 0 && (
                      <div
                        className={`category-dropdown absolute rounded-md border bg-white py-2 shadow-lg ${isOpen ? '' : 'hidden'
                          }`}
                        style={{
                          borderColor: "var(--brand-lavender-soft)",
                          zIndex: 99999,
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
      </div>
    </header>
  );
};

export default Header;
