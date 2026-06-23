import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#001e38] px-4 pt-8 pb-24 sm:px-6 sm:py-14 sm:pb-14 lg:px-10 xl:px-14 2xl:px-16">
      <div className="mx-auto w-full max-w-[1920px]">
        {/* Brand + quick links + policies + contact — flex on large screens keeps edges pinned */}
        <div className="flex flex-col gap-8 text-center sm:text-left lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:text-left xl:gap-12">
          {/* Left: logo + motive */}
          <div className="shrink-0 lg:max-w-[min(100%,280px)] xl:max-w-[300px] lg:pr-8 xl:pr-10">
            <Link to="/" className="inline-block no-underline">
              <img
                src="https://res.cloudinary.com/dbfooaz44/image/upload/v1775117601/Untitled_600_x_600_px_3_iujtam.png"
                alt="DesignBy Sakhi"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-6" style={{ color: "rgba(255,255,255,0.88)" }}>
              Crafting timeless jewellery that celebrates
              <br />
              your story, style, and special moments.
            </p>
          </div>

          {/* Center: quick links + policies */}
          <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-12 lg:flex-1 lg:justify-center lg:gap-16 lg:border-t-0 lg:pt-0 xl:gap-20">
          {/* Quick links */}
          <div className="sm:text-center lg:pr-10 lg:text-left xl:pr-14">
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

          {/* Policies */}
          <div className="sm:text-center lg:pl-10 lg:text-left xl:pl-14">
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
          </div>

          {/* Right: contact + social */}
          <div className="shrink-0 border-t border-white/10 pt-8 text-center lg:max-w-[min(100%,320px)] lg:border-t-0 lg:pl-8 lg:pt-0 lg:text-right xl:pl-10">
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFFFFF" }}
            >
              Contact
            </h3>
            <p className="text-sm flex items-center justify-center lg:justify-end gap-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.07 4.18 2 2 0 014.1 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <a href="tel:9130383655" className="no-underline text-white hover:opacity-90">
                9130383655
              </a>
            </p>
            <p
              className="mt-2 flex items-start justify-center lg:justify-end gap-2 whitespace-nowrap text-xs sm:text-sm"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              <svg className="h-4 w-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm8 8l8-6H4l8 6z" />
              </svg>
              <a
                href="mailto:designsbyshakshi@gmail.com"
                className="no-underline text-white hover:opacity-90"
              >
                designsbyshakshi@gmail.com
              </a>
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.85)" }}>
                Follow us on
              </p>
              <div className="mt-3 flex items-center justify-center lg:justify-end gap-4">
                <a
                  href="https://www.instagram.com/design.by.shakshi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-white hover:opacity-90 transition"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.5 6.5h.01" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/Designs-by-Shakshi/61564974746533/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-white hover:opacity-90 transition"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919130383655"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="text-white hover:opacity-90 transition"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.5 3.5L21 7l-1 14-14 1L3 20.5l.5-14L7 4l13.5-.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 11.5c1.2 2.4 2.6 3.2 5 4.5l2-2c.4-.4 1-.6 1.5-.4l2 1c.4.2.6.7.4 1.1-.8 1.7-2.3 2.7-4.2 2.7-3.6 0-6.9-2.7-8.6-6.3-1.6-3.4-.8-6.6 1.3-8.5.4-.4 1-.4 1.4 0l1.2 1.2c.4.4.5 1 .3 1.5l-.9 2.2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar – copyright + legal */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-10 sm:flex-row sm:items-start"
          style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
        >
          <p className="text-xs sm:text-[13px]">
            © {currentYear}, DesignsByShakshi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end sm:gap-4 text-xs sm:text-[13px]">
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
