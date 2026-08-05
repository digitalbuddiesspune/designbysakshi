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
    <section className="bg-[var(--brand-pastel)] px-4 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 lg:px-8 lg:pt-10 lg:pb-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <h1
            className="text-3xl lg:text-4xl font-semibold text-center"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Shop By Category
          </h1>
        </div>

        <div className="overflow-x-auto scrollbar-hide px-2 pb-1 pt-2 sm:px-3 sm:pt-3">
          <div className="mx-auto flex w-max max-w-none flex-nowrap justify-center gap-5 sm:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.href}
                className="group flex w-[88px] flex-shrink-0 flex-col items-center gap-1.5 sm:w-[140px] sm:gap-3"
              >
                <div className="relative mt-0.5 h-[88px] w-[88px] overflow-hidden rounded-full shadow-md sm:mt-2 sm:h-[130px] sm:w-[130px]">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="h-full w-full rounded-full object-cover object-[center_62%]"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.parentElement?.querySelector(".category-fallback");
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`category-fallback absolute inset-0 items-center justify-center rounded-full bg-[var(--brand-lavender)] text-[var(--brand-dark)] ${
                      cat.image ? "hidden" : "flex"
                    }`}
                    aria-hidden
                  >
                    <span className="px-1 text-center text-[10px] font-bold sm:px-2 sm:text-sm">
                      {cat.label}
                    </span>
                  </div>
                </div>
                <span
                  className="line-clamp-1 w-full text-center text-[11px] font-bold tracking-wide sm:text-sm"
                  style={{
                    color: "var(--brand-dark)",
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                  }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mx-auto mt-6 h-px w-full max-w-4xl sm:mt-8 lg:mt-10"
          style={{
            background: "linear-gradient(to right, transparent, var(--brand-muted), transparent)",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
};

export default ShopByCategory;
