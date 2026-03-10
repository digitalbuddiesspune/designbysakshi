import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { title: "Rings", href: "/shop?category=rings", count: "12" },
  { title: "Necklaces", href: "/shop?category=necklaces", count: "8" },
  { title: "Bracelets", href: "/shop?category=bracelets", count: "10" },
  { title: "Earrings", href: "/shop?category=earrings", count: "14" },
];

const Shop = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="mb-2 text-center text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--brand-muted)" }}
          >
            Shop
          </h1>
          <p
            className="mx-auto max-w-xl text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Handcrafted pieces for every moment
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={cat.href}
                className="group block overflow-hidden rounded-lg border text-center no-underline transition hover:shadow-lg"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  background: "white",
                }}
              >
                <div
                  className="flex h-48 items-center justify-center"
                  style={{ background: "var(--brand-cream)" }}
                >
                  <span
                    className="text-4xl opacity-60 transition group-hover:opacity-100"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    ✦
                  </span>
                </div>
                <div className="p-4">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {cat.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
                    {cat.count} pieces
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-12 text-center text-sm" style={{ color: "var(--brand-muted)" }}>
            More products coming soon. Browse by category above.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Shop;
