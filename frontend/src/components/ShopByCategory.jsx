import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        const excluded = new Set(["latest-collection", "bestseller", "new-arrival"]);
        const mapped = (Array.isArray(data) ? data : [])
          .filter((cat) => !excluded.has(String(cat?.slug || "").toLowerCase()))
          .map((cat) => ({
            id: String(cat?.slug || ""),
            label: cat?.name || "",
            href: `/${cat?.slug || ""}`,
            image: cat?.image || "",
            priority: Number.isFinite(cat?.priority) ? cat.priority : 999,
          }))
          .filter((cat) => cat.id)
          .sort((a, b) => a.priority - b.priority);

        setCategories(mapped);
      } catch {
        setCategories([]);
      }
    };
    load();
  }, []);

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

        <div className="overflow-x-auto scrollbar-hide py-4 px-2 sm:px-3">
          <div className="flex flex-nowrap justify-start gap-6 sm:gap-10 w-max">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.href}
                className="group flex w-[120px] sm:w-[140px] flex-shrink-0 flex-col items-center gap-4 transition-transform hover:-translate-y-2"
              >
              <div
                className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full ring-2 ring-offset-4 ring-[#3D294D] shadow-md transition-shadow group-hover:shadow-xl"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover rounded-full object-center p-1.5 transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = e.target.parentElement?.querySelector(".category-fallback");
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`category-fallback absolute inset-0 items-center justify-center bg-[var(--brand-lavender)] text-[var(--brand-dark)] ${
                    cat.image ? "hidden" : "flex"
                  }`}
                  aria-hidden
                >
                  <span className="text-3xl font-bold text-center px-2">{cat.label}</span>
                </div>
              </div>
              <span 
                className="text-center text-sm font-bold tracking-wide"
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
          style={{ background: "linear-gradient(to right, transparent, var(--brand-muted), transparent)" }}
          aria-hidden
        />
      </div>
    </section>
  );
};

export default ShopByCategory;
