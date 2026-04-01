import React from "react";
import { Link } from "react-router-dom";

const TermsConditions = () => {
  const sections = [
    { id: "terms-general", label: "1) General" },
    { id: "terms-pricing", label: "2) Pricing & Products" },
    { id: "terms-orders", label: "3) Orders & Payment" },
    { id: "terms-ip", label: "4) Intellectual Property" },
    { id: "terms-accounts", label: "5) Accounts & Liability" },
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
            Terms &amp; Conditions
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
                      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm no-underline transition hover:bg-[#F9F5F6] hover:text-white lg:rounded-xl"
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
            <div id="terms-general" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    1. General
                  </h2>
                </div>
                <p>
                  Welcome to DesignBySakshi. By accessing and using our website, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part, please do not use our site.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div id="terms-pricing" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    2. Pricing & Products
                  </h2>
                </div>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-green-400">
                  <li>Products are subject to availability.</li>
                  <li>Prices are in INR and include taxes unles stated otherwise.</li>
                  <li>We can modify prices anytime without prior notice.</li>
                  <li>Images are illustrative; handcrafted items may vary slightly.</li>
                </ul>
              </div>
            </div>

            {/* Box 3 */}
            <div id="terms-orders" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    3. Orders & Payment
                  </h2>
                </div>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-blue-400">
                  <li>Ensure all order details are accurate.</li>
                  <li>Secure payments via UPI, cards, and net banking.</li>
                  <li>Orders confirm upon successful payment receipt.</li>
                  <li>We can cancel orders for suspected fraudulent activity.</li>
                </ul>
              </div>
            </div>

            {/* Box 4 */}
            <div id="terms-ip" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    4. Intellectual Property
                  </h2>
                </div>
                <p>
                  All content here—text, images, logos, designs, graphics—is the intellectual property of DesignBySakshi. You may not reproduce, distribute, or use it without prior written consent.
                </p>
              </div>
            </div>

            {/* Box 5: Merged Legal Stuff */}
            <div id="terms-accounts" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden md:col-span-2">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-50 rounded-full opacity-50 group-hover:scale-[3] transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 flex items-center gap-4 md:w-1/3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    Accounts & Liability
                  </h2>
                </div>
                <div className="md:w-2/3 flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span>User Accounts</h3>
                    <p className="text-sm mt-1">You are responsible for keeping your credentials safe. We may terminate accounts violating these terms.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Limitation of Liability & Law</h3>
                    <p className="text-sm mt-1">We aren't liable for indirect/consequential damages. Our total liability won't exceed the product amount. These terms are governed by the laws of India.</p>
                  </div>
                  <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium">We occasionally update these terms.</span>
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

export default TermsConditions;
