import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    { id: "privacy-introduction", label: "1) Introduction" },
    { id: "privacy-information", label: "2) Information We Collect" },
    { id: "privacy-usage", label: "3) How We Use Information" },
    { id: "privacy-sharing", label: "4) Information Sharing" },
    { id: "privacy-other", label: "5) Other Policies" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            Legal
          </h1>
          <p
            className="mb-8 text-center text-3xl lg:text-4xl font-semibold"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Privacy Policy
          </p>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_1fr] lg:gap-8">
            <aside className="lg:sticky lg:top-36 lg:self-start">
              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand-muted)" }}>
                  On this page
                </p>
                <div className="flex gap-2 overflow-x-auto lg:flex-col">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm no-underline transition hover:bg-[#F9F5F6] lg:rounded-xl"
                      style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                    >
                      {section.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <div className="grid grid-cols-1 gap-6 text-base leading-relaxed text-gray-600 md:grid-cols-2">
            {/* Box 1 */}
            <div id="privacy-introduction" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    1. Introduction
                  </h2>
                </div>
                <p>
                  At DesignBySakshi, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div id="privacy-information" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    2. Information We Collect
                  </h2>
                </div>
                <p className="mb-3">We may collect the following types of information:</p>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-purple-400">
                  <li>Personal details (name, email, phone, shipping address).</li>
                  <li>Payment securely processed via partners.</li>
                  <li>Browsing data (IP, browser type, pages visited).</li>
                  <li>Communication data from support interactions.</li>
                </ul>
              </div>
            </div>

            {/* Box 3 */}
            <div id="privacy-usage" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    3. How We Use Information
                  </h2>
                </div>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-green-400">
                  <li>To process and fulfil your orders and shipping.</li>
                  <li>To communicate order status and support.</li>
                  <li>To send updates and newsletters (opt-out anytime).</li>
                  <li>To improve website, products, and safety.</li>
                </ul>
              </div>
            </div>

            {/* Box 4 */}
            <div id="privacy-sharing" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    4. Information Sharing
                  </h2>
                </div>
                <p>
                  We never sell, trade, or rent your personal information. We may share your data conditionally with trusted service providers (payment securely, shipping) to operate our business and assist you.
                </p>
              </div>
            </div>

            {/* Box 5 */}
            <div id="privacy-other" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden md:col-span-2">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-50 rounded-full opacity-50 group-hover:scale-[3] transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 flex items-center gap-4 md:w-1/3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    Other Policies
                  </h2>
                </div>
                <div className="md:w-2/3 flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span>Cookies</h3>
                    <p className="text-sm mt-1">Our website uses cookies to enhance browsing, analyse traffic, and personalise content. You may disable them anytime via browser settings.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span>Data Security & Your Rights</h3>
                    <p className="text-sm mt-1">We implement top security measures to protect your info. You retain the right to access, update, or request deletion of data at any time.</p>
                  </div>
                  <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium">Questions? Contact us anytime.</span>
                    <Link to="/contact" className="px-5 py-2 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
