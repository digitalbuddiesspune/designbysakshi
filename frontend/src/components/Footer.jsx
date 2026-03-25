import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire to newsletter API
  };

  return (
    <footer
      className="mt-auto w-full px-4 py-12 sm:px-6 lg:px-8"
      style={{ background: "var(--brand-pastel)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Subscribe + Quick links + Categories + Collections + Policies + Brand */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Subscribe to our emails */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Subscribe
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--brand-muted)" }}>
              Get updates on new arrivals, offers, and collections.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              />
              <button
                type="submit"
                className="rounded-md px-4 py-2 text-sm transition hover:opacity-90"
                style={{
                  background: "#3D294D",
                  color: "white",
                  border: "1px solid #3D294D",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Quick links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/necklace-sets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Necklace Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/earrings"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  to="/ring"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  to="/bangles-bracelets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Bangles & Bracelets
                </Link>
              </li>
              <li>
                <Link
                  to="/pendants"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Pendants
                </Link>
              </li>
              <li>
                <Link
                  to="/bridal-jewellery"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Bridal Jewellery
                </Link>
              </li>
              <li>
                <Link
                  to="/anklets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Anklets
                </Link>
              </li>
              <li>
                <Link
                  to="/latest-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Latest Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/bestseller"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Bestseller
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrival"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  New Arrival
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Collections
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/wedding-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/festive-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Festive Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/partywear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Partywear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/dailywear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Dailywear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/officewear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Officewear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/luxuryad-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Luxury Ad Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block no-underline" style={{ color: "var(--brand-dark)" }}>
              <span className="text-lg font-semibold tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                DesignBy
              </span>
              <span className="text-xl" style={{ fontFamily: "Great Vibes, Georgia, cursive" }}>
                Sakshi
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm" style={{ color: "var(--brand-muted)" }}>
              Handcrafted jewellery for the modern soul.
            </p>
          </div>
        </div>

        {/* Bottom bar – copyright + legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: "var(--brand-muted)", color: "var(--brand-muted)" }}>
          <p className="text-sm">
            © {currentYear}, DesignBySakshi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link to="/privacy-policy" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Privacy Policy
            </Link>
            <Link to="/refund-policy" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Refund & Cancellation
            </Link>
            <Link to="/shipping-policy" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Shipping Policy
            </Link>
            <Link to="/terms-conditions" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
