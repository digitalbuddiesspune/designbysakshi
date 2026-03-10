import React, { useState } from "react";
import { Link } from "react-router-dom";

const categoryBar = [
  {
    label: "Necklace",
    slug: "necklace",
    sub: [
      { label: "AD Sets", slug: "ad-sets" },
      { label: "Short Necklace", slug: "short-necklace" },
      { label: "Long Necklace", slug: "long-necklace" },
      { label: "Choker", slug: "choker" },
      { label: "Layered", slug: "layered" },
    ],
  },
  {
    label: "Mangal Sutra",
    slug: "mangal-sutra",
    sub: [
      { label: "Golden", slug: "golden" },
      { label: "Silver", slug: "silver" },
    ],
  },
  {
    label: "Earrings",
    slug: "earrings",
    sub: [
      { label: "Studs", slug: "studs" },
      { label: "Jhumkas", slug: "jhumkas" },
      { label: "Long Earrings", slug: "long-earrings" },
      { label: "Drops", slug: "drops" },
    ],
  },
  {
    label: "Bracelets",
    slug: "bracelets",
    sub: [
      { label: "Adjustable Bracelets", slug: "adjustable-bracelets" },
    ],
  },
];

const Header = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const subHref = (catSlug, subSlug) => `/shop?category=${catSlug}&type=${subSlug}`;
  const mainHref = (slug) => `/shop?category=${slug}`;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ background: "var(--brand-pastel)", borderColor: "var(--brand-lavender-soft)" }}
    >
      {/* Top row: logo, nav, search, cart */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 md:h-24">
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

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <Link
            to="/shop"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            Shop
          </Link>
          <Link
            to="/collections"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            Collections
          </Link>
          <Link
            to="/about"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-base font-medium no-underline transition hover:opacity-90 sm:text-lg"
            style={{ color: "var(--brand-dark)" }}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4" style={{ color: "var(--brand-dark)" }}>
          <button
            type="button"
            className="rounded p-2 transition hover:opacity-80"
            aria-label="Search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link
            to="/cart"
            className="rounded p-2 no-underline transition hover:opacity-80"
            aria-label="Cart"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Category bar: 4 main categories with subcategories */}
      <div
        className="border-t"
        style={{ borderColor: "var(--brand-lavender-soft)", background: "white" }}
      >
        <div className="flex w-full justify-center px-4 sm:px-6 lg:px-8">
          <nav className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-1 py-1.5 md:gap-6 md:py-2" aria-label="Categories">
            {categoryBar.map((cat) => (
              <div
                key={cat.slug}
                className="relative group/cat"
                onMouseEnter={() => setOpenCategory(cat.slug)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                {/* Main category: click opens on mobile, hover on desktop */}
                <div className="flex items-center">
                  <Link
                    to={mainHref(cat.slug)}
                    className="hidden py-1.5 text-sm font-medium no-underline transition hover:opacity-90 md:inline-block"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    {cat.label}
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 py-1.5 pr-1 text-sm font-medium md:hidden"
                    style={{ color: "var(--brand-dark)" }}
                    onClick={() => setOpenCategory(openCategory === cat.slug ? null : cat.slug)}
                    aria-expanded={openCategory === cat.slug}
                    aria-haspopup="true"
                  >
                    {cat.label}
                    <svg
                      className={`h-4 w-4 transition ${openCategory === cat.slug ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Dropdown: visible on hover (desktop) or when open (mobile) */}
                {cat.sub.length > 0 && (
                  <div
                    className={`absolute left-1/2 top-full z-10 min-w-[180px] -translate-x-1/2 rounded-md border bg-white py-2 shadow-lg transition md:invisible md:opacity-0 md:group-hover/cat:visible md:group-hover/cat:opacity-100 ${
                      openCategory === cat.slug ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                    style={{ borderColor: "var(--brand-lavender-soft)" }}
                  >
                    {cat.sub.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={subHref(cat.slug, sub.slug)}
                        className="block px-4 py-2 text-sm no-underline transition hover:opacity-90"
                        style={{ color: "var(--brand-dark)" }}
                        onClick={() => setOpenCategory(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
