import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ShopByCollection = () => {
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);
  const [isDesktopBeginning, setIsDesktopBeginning] = useState(true);
  const [isDesktopEnd, setIsDesktopEnd] = useState(false);
  const [isMobileBeginning, setIsMobileBeginning] = useState(true);
  const [isMobileEnd, setIsMobileEnd] = useState(false);
  const [items, setItems] = useState([]);

  const getLatestSubFromRoute = (route) => {
    const slug = String(route || "").split("/").pop();
    return slug || "";
  };

  // Only show items that actually have an image to avoid blank space
  const visibleItems = (items || []).filter((it) => typeof it.image === "string" && it.image.trim().length > 0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/collection-showcase`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  const visibleCount = visibleItems.length;

  return (
    <section className="">
      <div className="w-full">
         <div className="mb-6">
         <h1 
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            Shop By Collection
          </h1>         
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Desktop (md+): show scroll only when more than 2 */}
          <div className="hidden md:block">
            {visibleCount <= 2 ? (
              <div className={`grid gap-6 ${visibleCount === 1 ? "grid-cols-1 justify-items-center" : "grid-cols-2"}`}>
                {visibleItems.map((it, index) => {
                  const sub = getLatestSubFromRoute(it.route);
                  const href = sub
                    ? `/latest-collection?subcategory=${encodeURIComponent(sub)}`
                    : it.route || "#";
                  const single = visibleCount === 1;
                  return (
                    <Link
                      key={index}
                      to={href}
                      className={`block overflow-hidden flex items-center justify-center p-2 ${
                        single ? "w-full md:w-1/2" : "w-full"
                      }`}
                    >
                      <img
                        src={it.image}
                        alt={it.title || `Collection ${index + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <>
                <Swiper
                  onSwiper={(s) => {
                        desktopSwiperRef.current = s;
                  }}
                  onSlideChange={(s) => {
                        setIsDesktopBeginning(s.isBeginning);
                        setIsDesktopEnd(s.isEnd);
                  }}
                  spaceBetween={12}
                  slidesPerView={2}
                  slidesPerGroup={1}
                  loop={false}
                  allowTouchMove={true}
                >
                  {visibleItems.map((it, index) => {
                    const sub = getLatestSubFromRoute(it.route);
                    const href = sub
                      ? `/latest-collection?subcategory=${encodeURIComponent(sub)}`
                      : it.route || "#";
                    return (
                      <SwiperSlide key={index}>
                        <Link
                          to={href}
                          className="block w-full overflow-hidden flex items-center justify-center p-2"
                        >
                          <img
                            src={it.image}
                            alt={it.title || `Collection ${index + 1}`}
                            className="w-full h-auto object-contain"
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {/* Prev */}
                <button
                  onClick={() => desktopSwiperRef.current?.slidePrev()}
                  disabled={isDesktopBeginning}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#3D294D] p-3 shadow-lg transition-all hover:bg-[#3D294D]/90 disabled:opacity-30 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  onClick={() => desktopSwiperRef.current?.slideNext()}
                  disabled={isDesktopEnd}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#3D294D] p-3 shadow-lg transition-all hover:bg-[#3D294D]/90 disabled:opacity-30 cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Mobile (<md): show scroll only when more than 1 */}
          <div className="md:hidden">
            {visibleCount <= 1 ? (
              <div className="flex justify-center">
                {visibleItems.map((it, index) => {
                  const sub = getLatestSubFromRoute(it.route);
                  const href = sub
                    ? `/latest-collection?subcategory=${encodeURIComponent(sub)}`
                    : it.route || "#";
                  return (
                    <Link
                      key={index}
                      to={href}
                      className="block w-auto overflow-hidden flex items-center justify-center p-2"
                    >
                      <img
                        src={it.image}
                        alt={it.title || `Collection ${index + 1}`}
                        className="w-auto h-auto max-w-full object-contain"
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <>
                <Swiper
                  onSwiper={(s) => {
                    mobileSwiperRef.current = s;
                  }}
                  onSlideChange={(s) => {
                    setIsMobileBeginning(s.isBeginning);
                    setIsMobileEnd(s.isEnd);
                  }}
                  spaceBetween={12}
                  slidesPerView={1}
                  slidesPerGroup={1}
                  loop={false}
                  allowTouchMove={true}
                >
                  {visibleItems.map((it, index) => {
                    const sub = getLatestSubFromRoute(it.route);
                    const href = sub
                      ? `/latest-collection?subcategory=${encodeURIComponent(sub)}`
                      : it.route || "#";
                    return (
                      <SwiperSlide key={index}>
                        <Link
                          to={href}
                          className="block w-full overflow-hidden flex items-center justify-center p-2"
                        >
                          <img
                            src={it.image}
                            alt={it.title || `Collection ${index + 1}`}
                            className="w-full h-auto object-contain"
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {/* Prev */}
                <button
                  onClick={() => mobileSwiperRef.current?.slidePrev()}
                  disabled={isMobileBeginning}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#3D294D] p-3 shadow-lg transition-all hover:bg-[#3D294D]/90 disabled:opacity-30 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  onClick={() => mobileSwiperRef.current?.slideNext()}
                  disabled={isMobileEnd}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#3D294D] p-3 shadow-lg transition-all hover:bg-[#3D294D]/90 disabled:opacity-30 cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
