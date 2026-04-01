import React from "react";
import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  const sections = [
    { id: "shipping-processing", label: "1) Processing Time" },
    { id: "shipping-methods", label: "2) Methods & Delivery" },
    { id: "shipping-charges", label: "3) Shipping Charges" },
    { id: "shipping-tracking", label: "4) Order Tracking" },
    { id: "shipping-important", label: "5) Important Details" },
    { id: "shipping-contact", label: "6) Shipping Questions" },
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
            Shipping Policy
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
                      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm no-underline transition hover:bg-[#FFDCDC] hover:text-white lg:rounded-xl"
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
            <div id="shipping-processing" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    1. Processing Time
                  </h2>
                </div>
                <p>
                  All orders are processed within 1–3 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div id="shipping-methods" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    2. Methods &amp; Delivery
                  </h2>
                </div>
                <p className="mb-2">We offer the following shipping options within India:</p>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-purple-400">
                  <li><strong>Standard Shipping:</strong> 5–7 business days.</li>
                  <li><strong>Express Shipping:</strong> 2–3 business days (available at an additional cost).</li>
                </ul>
                <p className="mt-3 text-sm italic">
                  *Delivery times are estimates and may vary for remote areas.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div id="shipping-charges" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    3. Shipping Charges
                  </h2>
                </div>
                <p>
                  Calculated at checkout based on your delivery location and chosen method. We frequently offer free shipping on orders above a certain value—any active offers will be highlighted at checkout!
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div id="shipping-tracking" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-teal-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    4. Order Tracking
                  </h2>
                </div>
                <p>
                  Once shipped, you'll receive a confirmation email with a tracking number. Use this number on the courier partner's website to monitor the live status of your delivery.
                </p>
              </div>
            </div>

            {/* Box 5 */}
            <div id="shipping-important" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden md:col-span-2">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover:scale-[3] transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 flex items-center gap-4 md:w-1/3">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    Important Details
                  </h2>
                </div>
                <div className="md:w-2/3 flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>Failed Deliveries</h3>
                    <p className="text-sm mt-1">If delivery fails due to incorrect address or refusal, the order may return to us. You will be responsible for re-shipping charges. Please ensure complete addresses!</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>International Shipping</h3>
                    <p className="text-sm mt-1">At present, we ship only within India. We are working towards expanding globally soon.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>Damaged Shipments</h3>
                    <p className="text-sm mt-1">If damaged, contact us within 48 hours of delivery with photos for a free replacement/refund as per our <Link to="/refund-policy" className="text-purple-600 hover:underline">Refund Policy</Link>.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Box 6: Contact */}
            <div id="shipping-contact" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center justify-center text-center md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-50 z-0"></div>
              <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    Any Shipping Questions?
                  </h2>
                  <p className="mb-6">Reach out to us and we'll gladly help you track or manage your shipment.</p>
                  <Link to="/contact" className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition shadow-md hover:shadow-lg">
                    Contact Us
                  </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
