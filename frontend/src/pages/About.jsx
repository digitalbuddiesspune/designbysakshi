import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4  mb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
        <div
          className="mx-auto max-w-6xl rounded-2xl  p-4 sm:p-6 lg:p-8"
        >
          <h1
            className="text-3xl lg:text-4xl   mb-5 font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            About Us 
          </h1>
          
          <div className="mx-auto mb-12 max-w-4xl text-center text-base leading-7 sm:text-lg" style={{ color: "var(--brand-muted)" }}>
            <p>
              At DesignsByShakshi, every piece is created to feel special, wearable, and timeless. We design jewelry that fits your everyday style while still feeling elegant enough for celebrations. Our goal is simple: to bring you pieces that look beautiful, feel premium, and become a part of your story for years.
            </p>
          </div>

          <div className="space-y-10 lg:space-y-12">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr]">
              <div className="flex justify-center pl-4 sm:pl-8 lg:justify-center lg:pl-6">
                <div className="flex h-[290px] w-full max-w-sm items-end justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-0 shadow-md sm:h-[330px] lg:h-[380px]">
                  <img
                    src="/owner2.png"
                    alt="Sakshi - Designs By Sakshi"
                    className="max-h-full max-w-full object-contain object-bottom"
                  />
                </div>
              </div>
              <div className="lg:pl-8">
                <h2
                  className="mb-3 text-3xl font-semibold"
                  style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  Our Story
                </h2>
                <p className="text-base leading-7 sm:text-lg" style={{ color: "var(--brand-muted)" }}>
                  DesignsByShakshi started from a passion for creating jewelry that feels personal and meaningful. What began as a small dream has grown into a brand loved for graceful designs, quality finishing, and thoughtful details. We believe jewelry should not only complete your look, but also carry emotions, memories, and confidence in every wear.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
              <div className="flex justify-center lg:order-2">
                <div className="flex h-[250px] w-full max-w-md items-end justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-0 shadow-md sm:h-[290px] lg:h-[330px]">
                  <img
                    src="https://res.cloudinary.com/dbfooaz44/image/upload/v1775112209/Untitled_1080_x_1080_px_1080_x_600_px_700_x_600_px_700_x_500_px_650_x_500_px_huzm4s.png"
                    alt="Our Brand Store"
                    className="max-h-full max-w-full object-contain object-bottom"
                  />
                </div>
              </div>
              <div className="lg:order-1 lg:pr-8">
                <h2
                  className="mb-3 text-3xl font-semibold"
                  style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  About Brand Store
                </h2>
                <p className="text-base leading-7 sm:text-lg" style={{ color: "var(--brand-muted)" }}>
                  Our brand store is built to give you a warm and premium shopping experience. From curated collections to expert support, every corner is designed to help you discover pieces that match your personality. Whether you are shopping for daily wear, gifting, or bridal moments, we bring trusted quality and elegant style under one roof.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <Link
              to="/"
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
