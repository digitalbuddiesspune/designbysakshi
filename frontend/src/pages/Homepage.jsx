import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ShopByCategory from "../components/ShopByCategory";
import ShopByCollection from "../components/ShopByCollection";
import TopProducts from "../components/TopProducts";
import HighlightGrid from "../components/HighlightGrid";
import WhyChooseUs from "../components/WhyChooseUs";
import TestimonialSection from "../components/TestimonialSection";
import NewCollection from "../components/NewCollection";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="space-y-6 sm:space-y-10">
        <ShopByCategory />
        <ShopByCollection />

        {/* Full-width banner above Top Products */}
        <section className="bg-white cursor-pointer">
          <Link to="" className="block w-full">
            {/* Desktop banner */}
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774436081/Untitled_1920_x_600_px_19_pbq3mb.png"
              alt="DesignBySakshi seasonal collection banner"
              className="hidden sm:block w-full h-auto object-cover"
            />
            {/* Mobile banner */}
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774436080/Untitled_1920_x_600_px_1080_x_900_px_1080_x_800_px_yigche.png"
              alt="DesignBySakshi seasonal collection banner"
              className="block sm:hidden w-full h-auto object-cover"
            />
          </Link>
        </section>

        <NewCollection />

        {/* Banner after Perfect Gifts */}
        <section className="bg-white cursor-pointer">
          <Link to="/bestseller" className="block w-full">
            {/* Desktop banner */}
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773743922/Untitled_1000_x_500_px_1920_x_550_px_w2i3cv.png"
              alt="DesignBySakshi collection banner"
              className="hidden sm:block w-full h-auto object-cover"
            />
            {/* Mobile banner */}
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773769833/5_b4kkui.png"
              alt="DesignBySakshi collection banner"
              className="block sm:hidden w-full h-auto object-cover"
            />
          </Link>
        </section>

        {/* Highlight products image grid (now serves as Bestsellers) */}
        <HighlightGrid />

        <TopProducts />

        <WhyChooseUs />

        <section className="bg-white">
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774522729/Untitled_1920_x_500_px_1_rmkrkg.png"
            alt="DesignBySakshi featured banner"
            className="hidden sm:block w-full h-auto object-cover"
          />
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774523516/Untitled_1920_x_500_px_1080_x_800_px_shbrqt.png"
            alt="DesignBySakshi featured banner"
            className="block sm:hidden w-full h-auto object-cover"
          />
        </section>

        <TestimonialSection />

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
            to="/"
            className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-medium text-white no-underline transition hover:opacity-95"
            style={{ background: "var(--brand-dark)" }}
          >
            Shop All
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
