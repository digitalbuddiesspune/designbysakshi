import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "necklace", label: "Necklace", href: "/shop?category=necklace", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772626408/23469a8f-9683-4f46-bfd8-2fe7091da443.png" },
  { id: "mangal-sutra", label: "Mangal Sutra", href: "/shop?category=mangal-sutra", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772632140/0486cd0846569729b6287de95d6ca5f9_jvurnm.jpg" },
  { id: "earrings", label: "Earrings", href: "/shop?category=earrings", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772630855/826a94f52e1b2e636bfe7b444f6c7133_p4z0b1.jpg" },
  { id: "bracelets", label: "Bracelets", href: "/shop?category=bracelets", image: "https://res.cloudinary.com/dfhjtmvrz/image/upload/v1772631046/c0358e5333f3f2a3ef34f4365f745819_oc7z80.jpg" },
];

const ShopByCategory = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-2xl font-medium text-[var(--brand-dark)] sm:text-3xl" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Shop by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="group flex w-[140px] flex-col items-center sm:w-[160px]"
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
