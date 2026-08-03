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
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <ShopByCategory />

        <div className="-mt-2 sm:-mt-4 lg:-mt-6">
          <TopProducts />
        </div>

        <section className="mt-6 sm:mt-8 lg:mt-10 cursor-pointer">
          <Link to="/bestseller" className="block w-full">
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1778229683/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1920_x_550_px_1_ngr69h.png"
              alt="DesignBySakshi bestseller banner"
              className="hidden sm:block w-full h-auto object-cover"
            />
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1778230160/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1080_x_500_px_luxba6.png"
              alt="DesignBySakshi bestseller banner"
              className="block sm:hidden w-full h-auto object-cover"
            />
          </Link>
        </section>

        <div className="mt-2 sm:mt-3 lg:mt-4">
          <HighlightGrid />
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10">
          <ShopByCollection />
        </div>

        {/* Full-width banner */}
        <section className="mt-6 sm:mt-8 cursor-pointer">
          <Link to="" className="block w-full">
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1778841072/Untitled_1920_x_200_px_ipqjw9.png"
              alt="DesignBySakshi seasonal collection banner"
              className="hidden sm:block w-full h-auto object-cover"
            />
            <img
              src="https://res.cloudinary.com/dbfooaz44/image/upload/v1778842095/Untitled_1920_x_200_px_1080_x_500_px_1_h6z9uc.png"
              alt="DesignBySakshi seasonal collection banner"
              className="block sm:hidden w-full h-auto object-cover mt-4"
            />
          </Link>
        </section>

        <div className="-mt-4 sm:-mt-6 lg:-mt-8">
          <NewCollection />
        </div>

        <div className="-mt-4 sm:-mt-6 lg:-mt-8">
          <WhyChooseUs />
        </div>

        <section className="mt-6 sm:mt-8">
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

        <div className="-mt-4 sm:-mt-6 lg:-mt-8">
          <TestimonialSection />
        </div>

        <div className="-mt-4 sm:-mt-6 lg:-mt-8">
        <section className="bg-transparent px-4 pb-10 pt-6 text-center sm:pb-16 sm:pt-5">
          <div className="mx-auto mb-5 flex max-w-xs items-center gap-3 sm:mb-7 sm:max-w-sm">
            <span className="h-px flex-1" style={{ background: "var(--brand-lavender-soft)" }} />
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="var(--brand-purple)"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="h-px flex-1" style={{ background: "var(--brand-lavender-soft)" }} />
          </div>

          <p
            className="mx-auto max-w-2xl text-xl font-medium sm:text-2xl lg:text-3xl"
            style={{ color: "var(--brand-dark)" }}
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
    </div>
  );
};

export default Homepage;
