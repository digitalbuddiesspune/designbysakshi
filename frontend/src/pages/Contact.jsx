import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to contact API
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            Contact
          </h1>
          <p
            className="mb-12 text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            We’d love to hear from you
          </p>

          <p className="mb-10 text-center" style={{ color: "var(--brand-muted)" }}>
            Questions, custom orders, or just saying hello—send us a message and we’ll get back to you soon.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border p-6 sm:p-8"
            style={{ borderColor: "var(--brand-lavender-soft)", background: "white" }}
          >
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded border px-4 py-3 outline-none"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded border px-4 py-3 outline-none"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                placeholder="you@example.com"
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
                className="w-full resize-y rounded border px-4 py-3 outline-none"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full py-3 text-sm font-medium text-white transition hover:opacity-95 sm:w-auto sm:px-10"
              style={{ background: "var(--brand-dark)" }}
            >
              Send message
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "var(--brand-muted)" }}>
            You can also reach us at{" "}
            <a href="mailto:hello@designbysakshi.com" className="underline" style={{ color: "var(--brand-dark)" }}>
              hello@designbysakshi.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
