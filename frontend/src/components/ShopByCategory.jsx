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
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-2xl font-medium text-[var(--brand-dark)] sm:text-3xl" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Shop by Category
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap justify-start gap-6 sm:gap-8 w-max mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.href}
                className="group flex w-[140px] flex-shrink-0 flex-col items-center sm:w-[160px]"
              >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#7C2D52] shadow-md transition group-hover:opacity-95"
                style={{
                  boxShadow: "0 4px 14px rgba(124, 45, 82, 0.25)",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.parentElement?.querySelector(".category-fallback");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <div
                  className="category-fallback absolute inset-0 hidden items-center justify-center bg-[#7C2D52] text-white/90"
                  aria-hidden
                >
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
              </div>
              <span className="mt-3 text-center text-base font-medium text-[var(--brand-dark)]">
                {cat.label}
              </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mt-8 h-px w-full"
          style={{ background: "var(--brand-lavender-soft)" }}
          aria-hidden
        />
      </div>
    </section>
  );
};

export default ShopByCategory;
