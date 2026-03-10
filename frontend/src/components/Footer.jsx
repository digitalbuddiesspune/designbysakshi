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
        {/* Subscribe + Quick links row */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subscribe to our emails */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-dark)" }}
            >
              Subscribe to our emails
            </h3>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 rounded-l border bg-white px-4 py-3 text-sm outline-none placeholder:opacity-80"
                style={{ borderColor: "var(--brand-dark)", color: "var(--brand-dark)" }}
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="rounded-r border border-l-0 px-4 py-3 transition hover:opacity-90"
                style={{ borderColor: "var(--brand-dark)", background: "white", color: "var(--brand-dark)" }}
                aria-label="Subscribe"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
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
                  to="/search"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Collections
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
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Privacy policy
            </Link>
            <Link to="/terms" className="no-underline transition hover:opacity-90" style={{ color: "var(--brand-muted)" }}>
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
