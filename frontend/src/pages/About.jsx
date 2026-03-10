import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            About
          </h1>
          <p
            className="mb-12 text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            The story behind DesignBySakshi
          </p>

          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--brand-muted)" }}>
            <p>
              DesignBySakshi began with a love for thoughtful design and a desire to create pieces that feel both timeless and personal. Every item is crafted with care, blending classic elegance with a modern sensibility.
            </p>
            <p>
              We believe in jewelry that you can wear every day—pieces that become part of your story and grow more meaningful over time. From delicate rings to layered necklaces, our collections are designed to complement your style and celebrate life’s moments.
            </p>
            <p>
              Thank you for being here. We hope you find something that speaks to you.
            </p>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="rounded-full px-8 py-3 text-sm font-medium text-white no-underline transition hover:opacity-95"
              style={{ background: "var(--brand-dark)" }}
            >
              Shop the collection
            </Link>
            <Link
              to="/contact"
              className="rounded-full border px-8 py-3 text-sm font-medium no-underline transition hover:opacity-90"
              style={{ borderColor: "var(--brand-dark)", color: "var(--brand-dark)" }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
