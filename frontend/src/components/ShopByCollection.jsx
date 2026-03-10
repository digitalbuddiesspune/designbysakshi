import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const collections = [
  {
    id: "fresh-drop",
    title: "Fresh Drop",
    subtitle: "Shiny & New Arrivals",
    cta: "Shop New In",
    href: "/shop?collection=fresh-drop",
    banner: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772708850/Untitled_1100_x_400_px_1000_x_500_px_ungb5d.png",
    products: [
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772630855/826a94f52e1b2e636bfe7b444f6c7133_p4z0b1.jpg",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772632140/0486cd0846569729b6287de95d6ca5f9_jvurnm.jpg",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772626408/23469a8f-9683-4f46-bfd8-2fe7091da443.png",
    ],
  },
  {
    id: "signature",
    title: "Signature Edit",
    subtitle: "Everyday luxury you can live in",
    cta: "Explore Signature",
    href: "/shop?collection=signature",
    banner: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772709522/Untitled_1000_x_500_px_zzbb3x.png",
    products: [
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772631046/c0358e5333f3f2a3ef34f4365f745819_oc7z80.jpg",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772619917/Gold_luxury_jewelry_banner_1920_x_600_px_1080_x_1080_px_cuvkzx.png",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772690252/Untitled_1920_x_600_px_1080_x_1080_px_7_pdhdtk.png",
    ],
  },
  {
    id: "gifting",
    title: "Gifting",
    subtitle: "Perfect for your loved ones",
    cta: "Shop Gifts",
    href: "/shop?collection=gifting",
    banner: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772709939/Untitled_1000_x_500_px_1_wq3qfr.png",
    products: [
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772626408/23469a8f-9683-4f46-bfd8-2fe7091da443.png",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772630855/826a94f52e1b2e636bfe7b444f6c7133_p4z0b1.jpg",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772632140/0486cd0846569729b6287de95d6ca5f9_jvurnm.jpg",
    ],
  },
  {
    id: "timeless",
    title: "Timeless",
    subtitle: "Crafted for you",
    cta: "Shop Now",
    href: "/shop?collection=timeless",
    banner: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772619917/Gold_luxury_jewelry_banner_1920_x_600_px_1080_x_1080_px_cuvkzx.png",
    products: [
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772631046/c0358e5333f3f2a3ef34f4365f745819_oc7z80.jpg",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772626408/23469a8f-9683-4f46-bfd8-2fe7091da443.png",
      "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772630855/826a94f52e1b2e636bfe7b444f6c7133_p4z0b1.jpg",
    ],
  },
];

const ShopByCollection = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2
          className="mb-8 text-center text-2xl font-medium sm:mb-10 sm:text-3xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Latest Collections
        </h2>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          className="!overflow-visible"
        >
          {collections.map((col) => (
            <SwiperSlide key={col.id} className="!h-auto">
              <div className="relative pb-14">
                {/* Background banner card */}
                <a
                  href={col.href}
                  className="block overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-gray-100"
                >
                  <div className="relative aspect-[32/13] w-full overflow-hidden rounded-3xl">
                    <img
                      src={col.banner}
                      alt={col.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </a>

                {/* Floating product cards centered over banner bottom edge */}
                <div className="pointer-events-none absolute inset-x-0 -bottom-8 flex justify-center gap-4 sm:gap-6">
                  {col.products.slice(0, 3).map((src, index) => (
                    <div
                      key={index}
                      className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md sm:h-24 sm:w-24"
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShopByCollection;

