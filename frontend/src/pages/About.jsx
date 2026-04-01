import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
        <div
          className="mx-auto max-w-6xl rounded-2xl border p-4 sm:p-6 lg:p-8"
          style={{ borderColor: "var(--brand-purple)" }}
        >
          <h1
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            About
          </h1>
          <p
            className="mb-6 text-center text-3xl lg:text-4xl font-semibold"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            The story behind DesignBySakshi
          </p>

          <div className="mx-auto mb-12 max-w-4xl text-center text-base leading-7 sm:text-lg" style={{ color: "var(--brand-muted)" }}>
            <p>
              At DesignBySakshi, every piece is created to feel special, wearable, and timeless. We design jewelry that fits your everyday style while still feeling elegant enough for celebrations. Our goal is simple: to bring you pieces that look beautiful, feel premium, and become a part of your story for years.
            </p>
          </div>

          <div className="space-y-10 lg:space-y-12">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <img
                  src="https://res.cloudinary.com/dbfooaz44/image/upload/q_auto/f_auto/v1775049378/free-photo-of-portrait-of-a-young-couple-posing-in-a-park_qntxio.jpg"
                  alt="Our Story"
                  className="h-[220px] w-full  object-cover shadow-md sm:h-[260px] lg:h-[320px]"
                />
              </div>
              <div className="lg:pl-8">
                <h2
                  className="mb-3 text-3xl font-semibold"
                  style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  Our Story
                </h2>
                <p className="text-base leading-7 sm:text-lg" style={{ color: "var(--brand-muted)" }}>
                  DesignBySakshi started from a passion for creating jewelry that feels personal and meaningful. What began as a small dream has grown into a brand loved for graceful designs, quality finishing, and thoughtful details. We believe jewelry should not only complete your look, but also carry emotions, memories, and confidence in every wear.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
              <div className="lg:order-2">
                <img
                  src="https://res.cloudinary.com/dbfooaz44/image/upload/q_auto/f_auto/v1775049445/ChatGPT_Image_Apr_1_2026_06_46_23_PM_nwbefl.png"
                  alt="Our Brand Store"
                  className="h-[300px] w-full  object-cover shadow-md sm:h-[260px] lg:h-[320px]"
                />
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
