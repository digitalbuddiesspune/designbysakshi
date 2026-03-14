import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const collectionImages = [
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773391977/Untitled_1000_x_500_px_13_z1xctg.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388740/Untitled_1100_x_400_px_1000_x_500_px_5_qlj3rk.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773394943/Untitled_1000_x_500_px_15_y8nxjg.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388741/Untitled_1000_x_500_px_2_1_hxzbet.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388741/Untitled_1000_x_500_px_4_1_fvr0ij.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773391975/Untitled_1000_x_500_px_14_rn2itw.png"
];

const ShopByCollection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiper, setSwiper] = useState(null);

  return (
    <section className="bg-white pt-2 pb-4 sm:pt-4 sm:pb-12">
      <div className="w-full">
        <h2
          className="mb-6 text-center text-2xl font-medium sm:mb-8 sm:text-3xl px-4"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Latest Collections
        </h2>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="overflow-hidden">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onSwiper={(swiperInstance) => {
                setSwiper(swiperInstance);
                // Update navigation after a short delay to ensure refs are ready
                setTimeout(() => {
                  if (prevRef.current && nextRef.current && swiperInstance && swiperInstance.params && swiperInstance.params.navigation) {
                    swiperInstance.params.navigation.prevEl = prevRef.current;
                    swiperInstance.params.navigation.nextEl = nextRef.current;
                    if (swiperInstance.navigation) {
                      swiperInstance.navigation.init();
                      swiperInstance.navigation.update();
                    }
                  }
                }, 100);
              }}
              onInit={(swiperInstance) => {
                if (prevRef.current && nextRef.current && swiperInstance && swiperInstance.params && swiperInstance.params.navigation) {
                  swiperInstance.params.navigation.prevEl = prevRef.current;
                  swiperInstance.params.navigation.nextEl = nextRef.current;
                  if (swiperInstance.navigation) {
                    swiperInstance.navigation.init();
                    swiperInstance.navigation.update();
                  }
                }
              }}
              spaceBetween={12}
              slidesPerView={1}
              loop={false}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 28,
                },
                1280: {
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
              }}
              className="collection-swiper-full"
              watchOverflow={true}
              allowTouchMove={true}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
            >
            {collectionImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden  flex items-center justify-center p-2">
                  <img
                    src={image}
                    alt={`Collection ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>

          {/* Custom Navigation Arrows */}
          <button
            ref={prevRef}
            onClick={() => swiper?.slidePrev()}
            className="swiper-button-prev-custom absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            ref={nextRef}
            onClick={() => swiper?.slideNext()}
            className="swiper-button-next-custom absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            aria-label="Next slide"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;

