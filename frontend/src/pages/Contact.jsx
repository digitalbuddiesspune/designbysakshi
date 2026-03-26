import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to contact API
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 pt-10 pb-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-3xl lg:text-4xl font-semibold text-center"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Contact Us
          </h1>
          <p
            className="mt-3 mb-8 text-center text-sm sm:text-base"
            style={{ color: "var(--brand-muted)" }}
          >
            Have a question or feedback? We would love to hear from you.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: "var(--brand-lavender-soft)", background: "white" }}
            >
              <h2 className="text-3xl font-semibold mb-6" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "#efeaf4", color: "var(--brand-dark)" }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: "var(--brand-dark)" }}>Our Location</p>
                    <p className="text-[15px] leading-6 mt-1" style={{ color: "var(--brand-muted)" }}>
                      Shop - C16A, Destination Streets of Europe, Maan Rd, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park,
                      Hinjawadi, pune, Hinjavadi, Maharashtra 411057
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "#efeaf4", color: "var(--brand-dark)" }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.7 2.9.8A2 2 0 0 1 22 16.9Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: "var(--brand-dark)" }}>Phone Number</p>
                    <a href="tel:9130383655" className="text-[15px] mt-1 inline-block no-underline" style={{ color: "var(--brand-muted)" }}>
                      +91 9130383655
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "#efeaf4", color: "var(--brand-dark)" }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: "var(--brand-dark)" }}>Email Address</p>
                    <a
                      href="mailto:designsbyshakshi@gmail.com"
                      className="text-[15px] mt-1 inline-block no-underline break-all"
                      style={{ color: "var(--brand-muted)" }}
                    >
                      designsbyshakshi@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: "var(--brand-lavender-soft)", background: "white" }}
            >
              <h2 className="text-2xl font-semibold mb-1" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                Send us a Message
              </h2>
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                  style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                  style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                  style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-y rounded-lg border px-4 py-3 outline-none"
                  style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  placeholder="Write your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-95"
                style={{ background: "var(--brand-dark)" }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div
          className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--brand-lavender-soft)" }}
        >
          <iframe
            title="DesignBySakshi Location Map"
            src="https://www.google.com/maps?q=Shop%20C16A%20Destination%20Streets%20of%20Europe%20Maan%20Rd%20Phase%201%20Hinjawadi%20Rajiv%20Gandhi%20Infotech%20Park%20Hinjawadi%20Pune%20Maharashtra%20411057&output=embed"
            className="h-[260px] w-full sm:h-[320px] md:h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
