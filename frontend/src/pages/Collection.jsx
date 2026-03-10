import React from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    name: "Signature",
    description: "Our most loved designs—timeless and versatile.",
    href: "/shop?collection=signature",
    accent: "var(--brand-gold)",
  },
  {
    name: "Layered",
    description: "Stackable and layering pieces for a curated look.",
    href: "/shop?collection=layered",
    accent: "var(--brand-lavender)",
  },
  {
    name: "Statement",
    description: "Bold pieces for special occasions.",
    href: "/shop?collection=statement",
    accent: "var(--brand-purple)",
  },
];

const Collection = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            Collections
          </h1>
          <p
            className="mx-auto max-w-xl text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Curated edits for every style
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {collections.map((col) => (
              <Link
                key={col.name}
                to={col.href}
                className="group block overflow-hidden rounded-lg border text-center no-underline transition hover:shadow-lg"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  background: "white",
                }}
              >
                <div
                  className="h-1.5 w-full transition group-hover:opacity-80"
                  style={{ background: col.accent }}
                />
                <div className="p-8">
                  <h2
                    className="mb-2 text-xl font-semibold"
                    style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {col.name}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
                    {col.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-12 text-center">
            <Link
              to="/shop"
              className="text-sm font-medium no-underline"
              style={{ color: "var(--brand-dark)" }}
            >
              View all in shop →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Collection;
