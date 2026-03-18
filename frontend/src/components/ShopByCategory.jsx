import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "necklace-sets",
    label: "Necklace Sets",
    href: "/necklace-sets",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773396951/necklace.jpg_cm747b.jpg",
  },
  {
    id: "earrings",
    label: "Earrings",
    href: "/earrings",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773227350/826a94f52e1b2e636bfe7b444f6c7133_p4z0b1_licyph.jpg",
  },
  {
    id: "rings",
    label: "Rings",
    href: "/rings",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773396952/rings.jpg_stwjj7.jpg",
  },
  {
    id: "bangles-bracelets",
    label: "Bangles & Bracelets",
    href: "/bangles-bracelets",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773227353/c0358e5333f3f2a3ef34f4365f745819_oc7z80_mpspdh.jpg",
  },
  {
    id: "pendants",
    label: "Pendants",
    href: "/pendants",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773227351/23469a8f-9683-4f46-bfd8-2fe7091da443_v5yzqs.png",
  },
  {
    id: "bridal-jewellery",
    label: "Bridal Jewellery",
    href: "/bridal-jewellery",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773396951/bridal.jpg_hyx0ih.jpg",
  },
  {
    id: "anklets",
    label: "Anklets",
    href: "/anklets",
    image:
      "https://res.cloudinary.com/dbfooaz44/image/upload/v1773396951/anklet.jpg_kcy23y.jpg",
  },
];

const ShopByCategory = () => {
  return (
    <section className="bg-[var(--brand-pastel)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
       
        <div className="mb-10 lg:mb-14">
          <h1 
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            Shop By Category
          </h1>
        </div>

        <div className="overflow-x-auto scrollbar-hide py-4 px-2">
          <div className="flex flex-nowrap justify-start lg:justify-center gap-6 sm:gap-10 w-max lg:w-full mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.href}
                className="group flex w-[120px] sm:w-[140px] flex-shrink-0 flex-col items-center gap-4 transition-transform hover:-translate-y-2"
              >
              <div
                className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full ring-2 ring-offset-4 ring-[var(--brand-lavender)] bg-[var(--brand-lavender-soft)] shadow-md transition-shadow group-hover:shadow-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.parentElement?.querySelector(".category-fallback");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <div
                  className="category-fallback absolute inset-0 hidden items-center justify-center bg-[var(--brand-lavender)] text-[var(--brand-dark)]"
                  aria-hidden
                >
                  <span className="text-xs font-medium text-center px-2">{cat.label}</span>
                </div>
              </div>
              <span 
                className="text-center text-sm font-medium tracking-wide"
                style={{ 
                  color: "var(--brand-dark)",
                  fontFamily: "Cormorant Garamond, Georgia, serif"
                }}
              >
                {cat.label}
              </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mt-12 h-px w-full max-w-4xl mx-auto"
          style={{ background: "linear-gradient(to right, transparent, var(--brand-lavender), transparent)" }}
          aria-hidden
        />
      </div>
    </section>
  );
};

export default ShopByCategory;
