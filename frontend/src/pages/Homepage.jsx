import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ShopByCategory from "../components/ShopByCategory";
import ShopByCollection from "../components/ShopByCollection";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ShopByCategory />
      <ShopByCollection />

      {/* CTA strip */}
      <section
        className="px-4 py-12 text-center sm:py-16"
        style={{ background: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
      >
        <p
          className="mx-auto max-w-2xl text-lg font-medium sm:text-xl"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Each piece is handcrafted with care. Discover our latest collections and find something that speaks to you.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-medium text-white no-underline transition hover:opacity-95"
          style={{ background: "var(--brand-dark)" }}
        >
          Shop All
        </Link>
      </section>
    </div>
  );
};

export default Homepage;
