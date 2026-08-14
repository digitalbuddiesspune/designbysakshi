import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#001E38] px-4 pt-10 pb-24 text-white sm:px-6 sm:pt-14 sm:pb-14 lg:px-10 xl:px-14">
      <div className="mx-auto w-full max-w-[1920px]">


        {/* Brand + Quick links + Policies + Contact */}
        <div className="flex flex-col gap-8 text-center sm:text-left lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:gap-12">
          {/* Left: Logo & Motive */}
          <div className="shrink-0 lg:max-w-[280px] xl:max-w-[300px]">
            <Link to="/" className="inline-block no-underline">
              <img
                src="https://res.cloudinary.com/dbfooaz44/image/upload/v1775117601/Untitled_600_x_600_px_3_iujtam.png"
                alt="DesignsByShakshi"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Crafting timeless jewellery that celebrates your story, style, and special moments.
            </p>
          </div>

          {/* Center: Quick Links & Policies */}
          <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-12 lg:flex-1 lg:justify-center lg:gap-16 lg:border-t-0 lg:pt-0 xl:gap-20">
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Contact</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
                Policies
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/privacy-policy" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Refund &amp; Return Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Shipping Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="group flex items-center justify-center gap-1.5 text-white/80 transition hover:text-white sm:justify-start">
                    <svg className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>Terms &amp; Conditions</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Contact & Social */}
          <div className="shrink-0 border-t border-white/10 pt-8 lg:max-w-[320px] lg:border-t-0 lg:pt-0 lg:text-right">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Get in Touch
            </h3>

            <div className="space-y-2.5 text-sm text-white/85">
              <a href="tel:9130383655" className="flex items-center justify-center gap-2 transition hover:text-white lg:justify-end">
                <svg className="h-4 w-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.415-5.12-3.707-6.535-6.535l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>+91 9130383655</span>
              </a>

              <a href="mailto:designsbyshakshi@gmail.com" className="flex items-center justify-center gap-2 text-xs sm:text-sm transition hover:text-white lg:justify-end">
                <svg className="h-4 w-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>designsbyshakshi@gmail.com</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Follow Us
              </p>
              <div className="mt-3 flex items-center justify-center gap-3 lg:justify-end">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/design.by.shakshi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#E1306C] hover:text-white"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/Designs-by-Shakshi/61564974746533/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#1877F2] hover:text-white"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919130383655"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#25D366] hover:text-white"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar – Copyright + Legal Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 sm:flex-row text-xs text-white/80">
          <p>© {currentYear}, DesignsByShakshi. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:justify-end">
            <Link to="/privacy-policy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/refund-policy" className="transition hover:text-white">
              Refund &amp; Return Policy
            </Link>
            <Link to="/shipping-policy" className="transition hover:text-white">
              Shipping Policy
            </Link>
            <Link to="/terms-conditions" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
