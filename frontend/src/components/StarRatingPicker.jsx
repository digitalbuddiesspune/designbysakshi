import React, { useState } from "react";

const STARS = [1, 2, 3, 4, 5];

const StarRatingPicker = ({ value = 5, onChange, label = "Rating" }) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div>
      {label ? (
        <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
      ) : null}
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label || "Star rating"}>
        {STARS.map((star) => {
          const filled = star <= active;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D294D]/40"
            >
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={filled ? 0 : 1.5}
                style={{ color: filled ? "#f59e0b" : "#d1d5db" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRatingPicker;
