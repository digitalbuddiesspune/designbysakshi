import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const desktopBanners = [
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773227061/Gold_luxury_jewelry_banner_1920_x_600_px_2_bk5rad.png",

  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773226925/Untitled_1920_x_600_px_15_spu6hk.png",
];

const mobileBanners = [
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773226954/Untitled_1920_x_600_px_1080_x_1080_px_1_ohtdgu.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773227061/Gold_luxury_jewelry_banner_1920_x_600_px_1080_x_1080_px_1_s4kdz9.png"
]


const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const banners = isMobile ? mobileBanners : desktopBanners;

  return (
    <section className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            {/* Mobile: 1080×1080 (square). Desktop: 1920×600 (wide) */}
            <div className="relative w-full aspect-square md:aspect-[32/10]">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;