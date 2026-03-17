import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const collectionImages = [
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773391977/Untitled_1000_x_500_px_13_z1xctg.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388740/Untitled_1100_x_400_px_1000_x_500_px_5_qlj3rk.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773394943/Untitled_1000_x_500_px_15_y8nxjg.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388741/Untitled_1000_x_500_px_2_1_hxzbet.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773388741/Untitled_1000_x_500_px_4_1_fvr0ij.png",
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773391975/Untitled_1000_x_500_px_14_rn2itw.png",
];

const ShopByCollection = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className="bg-white">
      <div className="w-full">
         <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-700">Shop By Collection</h1>
         
        </div>

        <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <Swiper
            onSwiper={(s) => { swiperRef.current = s; }}
            onSlideChange={(s) => {
              setIsBeginning(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
            spaceBetween={12}
            slidesPerView={1}
            slidesPerGroup={1}
            loop={false}
            allowTouchMove={true}
            breakpoints={{
              640:  { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 20 },
              768:  { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 24 },
              1024: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 28 },
              1280: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 32 },
            }}
          >
            {collectionImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="w-full overflow-hidden flex items-center justify-center p-2">
                  <img src={image} alt={`Collection ${index + 1}`} className="w-full h-auto object-contain" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
