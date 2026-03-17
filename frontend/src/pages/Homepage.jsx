import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ShopByCategory from "../components/ShopByCategory";
import ShopByCollection from "../components/ShopByCollection";
import TopProducts from "../components/TopProducts";
import HighlightGrid from "../components/HighlightGrid";
import WhyChooseUs from "../components/WhyChooseUs";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ShopByCategory />
      <ShopByCollection />

      {/* Full-width banner above Top Products */}
      <section className="bg-white pt-16 sm:pt-24">
        <img
          src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773383397/Untitled_1920_x_200_px_1920_x_300_px_1920_x_400_px_7_hdf4zv.png"
          alt="DesignBySakshi seasonal collection banner"
          className="block w-full h-auto object-cover"
        />
      </section>

      {/* Banner after Perfect Gifts */}
      <section className="bg-white pt-20 ">
        <img
          src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773743922/Untitled_1000_x_500_px_1920_x_550_px_w2i3cv.png"
          alt="DesignBySakshi collection banner"
          className="block w-full h-auto object-cover"
        />
      </section>

      {/* Highlight products image grid */}
      <HighlightGrid />

      <TopProducts />

      <WhyChooseUs />

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
