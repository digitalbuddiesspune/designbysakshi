import React from "react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  const sections = [
    { id: "refund-cancellations", label: "1) Cancellations" },
    { id: "refund-eligibility", label: "2) Return Eligibility" },
    { id: "refund-process", label: "3) Refund Process" },
    { id: "refund-help", label: "4) Need Help?" },
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
            Refund &amp; Cancellation Policy
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
            <div id="refund-cancellations" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    1. Cancellations
                  </h2>
                </div>
                <p>
                  Orders can be cancelled within 12 hours, provided the item has not been shipped. Contact us immediately. Once dispatched, it cannot be cancelled but may be eligible for return.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div id="refund-eligibility" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    2. Return Eligibility
                  </h2>
                </div>
                <ul className="ml-6 flex flex-col gap-2 list-disc marker:text-purple-400">
                  <li>Unused, unworn, original packaging.</li>
                  <li>Requests within 7 days of delivery.</li>
                  <li>Sale items or discount code orders may not be eligible.</li>
                  <li>Customised items are non-returnable.</li>
                </ul>
              </div>
            </div>

            {/* Box 3 */}
            <div id="refund-process" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-teal-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                    3. Refund Process
                  </h2>
                </div>
                <p>
                  Approved refunds processed within 7–10 days. Credited back to original payment method. Contact us immediately for damaged or defective products within 48 hours for a replacement.
                </p>
                <div className="mt-auto pt-4 flex gap-2">
                   <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium">Refund to Source</span>
                   <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium">No Direct Exchanges</span>
                </div>
              </div>
            </div>

            {/* Box 4 */}
            <div id="refund-help" className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto group-hover:scale-110 transition-transform duration-500">
                 <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                Need Help?
              </h2>
              <p className="mb-6 max-w-sm">Reach out to our support team for any queries regarding returns and refunds.</p>
              <Link to="/contact" className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition shadow-md hover:shadow-lg">
                Contact Support
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
