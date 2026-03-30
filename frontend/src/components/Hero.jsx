import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const API_URL = import.meta.env.VITE_API_URL;

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/banners`);
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((b) => {
          const desktop = (b.imageDesktop || b.imageMobile || "").trim();
          const mobile = (b.imageMobile || b.imageDesktop || "").trim();
          return {
            desktop,
            mobile,
            link: b.link || "",
            title: b.title || "",
          };
        });
        // Only keep banners that actually have a usable image to avoid empty src warnings
        const filtered = mapped.filter((m) => (m.desktop || m.mobile));
        setBanners(filtered);
      } catch {
        setBanners([]);
      }
    };
    loadBanners();
  }, []);

  const hasLoop = banners.length > 1;

  return (
    <section className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={hasLoop}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            {/* Mobile: 1080×1080 (square). Desktop: 1920×600 (wide) */}
            <div className="relative w-full aspect-square md:aspect-[32/10]">
              <a href={banner.link || "#"}>
                <img
                  src={isMobile ? (banner.mobile || banner.desktop) : (banner.desktop || banner.mobile)}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;