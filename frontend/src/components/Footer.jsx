import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#001e38] px-3 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Brand + contact + Quick links + Categories + Collections + Policies + Brand */}
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-5 lg:gap-10">
          {/* Left side logo + contact */}
          <div>
            <Link to="/" className="inline-block no-underline">
              <img
                src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774441947/Screenshot_2026-03-25_174920-removebg-preview_5_gwltrx.png"
                alt="DesignBy Sakhi"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
              Phone:{" "}
              <a href="tel:9130383655" className="no-underline text-white hover:opacity-90">
                9130383655
              </a>
            </p>
            <p className="mt-2 break-all text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
              Email:{" "}
              <a
                href="mailto:designsbyshakshi@gmail.com"
                className="no-underline text-white hover:opacity-90"
              >
                designsbyshakshi@gmail.com
              </a>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFFFFF" }}
            >
              Quick links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFFFFF" }}
            >
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/necklace-sets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Necklace Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/earrings"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  to="/ring"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  to="/bangles-bracelets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Bangles & Bracelets
                </Link>
              </li>
              <li>
                <Link
                  to="/pendants"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Pendants
                </Link>
              </li>
              <li>
                <Link
                  to="/bridal-jewellery"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Bridal Jewellery
                </Link>
              </li>
              <li>
                <Link
                  to="/anklets"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Anklets
                </Link>
              </li>
              <li>
                <Link
                  to="/bestseller"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Bestseller
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrival"
                  className="no-underline text-white transition hover:opacity-90"
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
              style={{ color: "#FFFFFF" }}
            >
              Latest Collections
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/wedding-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/festive-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Festive Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/partywear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Partywear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/dailywear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Dailywear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/officewear-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Officewear Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/luxuryad-collection"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
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
              style={{ color: "#FFFFFF" }}
            >
              Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="no-underline transition hover:opacity-90"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand */}
         
        </div>

        {/* Bottom bar – copyright + legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}>
          <p className="text-sm">
            © {currentYear}, DesignBySakshi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link to="/privacy-policy" className="no-underline transition hover:opacity-90" style={{ color: "rgba(255,255,255,0.85)" }}>
              Privacy Policy
            </Link>
            <Link to="/refund-policy" className="no-underline transition hover:opacity-90" style={{ color: "rgba(255,255,255,0.85)" }}>
              Refund & Cancellation
            </Link>
            <Link to="/shipping-policy" className="no-underline transition hover:opacity-90" style={{ color: "rgba(255,255,255,0.85)" }}>
              Shipping Policy
            </Link>
            <Link to="/terms-conditions" className="no-underline transition hover:opacity-90" style={{ color: "rgba(255,255,255,0.85)" }}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
