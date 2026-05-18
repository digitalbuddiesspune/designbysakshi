import React, { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const DESKTOP_PER_PAGE = 3;
const PAPER_CARD_IMG =
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1779085502/Untitled_design_5_rryuod.png";

const PURPLE = {
  quote: "#c4b0d4",
  text: "#3d294d",
  light: "#9a7fb0",
  star: "#8b6a9e",
  divider: "#b8a0c8",
};

const HeartIcon = ({ className = "h-3 w-3", filled = false, style }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    style={style}
    aria-hidden="true"
  >
    <path
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

const HeartDivider = () => (
  <div className="my-2.5 flex w-full max-w-[130px] items-center justify-center gap-2 sm:my-3 sm:max-w-[150px]">
    <span className="h-px flex-1" style={{ background: PURPLE.divider }} />
    <HeartIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" filled style={{ color: PURPLE.light }} />
    <span className="h-px flex-1" style={{ background: PURPLE.divider }} />
  </div>
);

const TestimonialCard = ({ testimonial }) => {
  const rating = testimonial.rating > 0 ? testimonial.rating : 5;

  return (
    <div className="relative mx-auto w-full">
      <article className="relative mx-auto aspect-[3/4] w-full max-w-[min(100%,300px)] lg:max-w-[280px]">
        <img
          src={PAPER_CARD_IMG}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-md"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pb-8 pt-14 text-center sm:px-6 sm:pb-9 sm:pt-16">
          <span
            className="t-serif block text-5xl leading-none sm:text-6xl"
            style={{ color: PURPLE.quote }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <p className="t-script mt-1 max-w-[92%] text-sm leading-relaxed sm:text-base" style={{ color: PURPLE.text }}>
            {testimonial.review}
            <HeartIcon className="ml-0.5 inline h-3.5 w-3.5 align-text-bottom" style={{ color: PURPLE.light }} />
          </p>

          <HeartDivider />

          <h3 className="t-serif text-lg font-bold sm:text-xl" style={{ color: PURPLE.text }}>
            {testimonial.name}
          </h3>

          <p
            className="t-script mt-1 flex items-center justify-center gap-1 text-sm sm:text-base"
            style={{ color: PURPLE.light }}
          >
            Happy Client
            <HeartIcon className="h-3 w-3" style={{ color: PURPLE.light }} />
          </p>

          <div className="mt-2.5 flex items-center justify-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ color: i < rating ? PURPLE.star : "var(--brand-lavender)" }}
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updatePerPage = () => setPerPage(media.matches ? DESKTOP_PER_PAGE : 1);
    updatePerPage();
    media.addEventListener("change", updatePerPage);
    return () => media.removeEventListener("change", updatePerPage);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [perPage]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));

  const goNext = useCallback(() => {
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return undefined;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [totalPages, goNext]);

  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  if (loading || testimonials.length === 0) return null;

  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  const gridClass =
    perPage === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : visible.length === 2
        ? "grid-cols-2 max-w-2xl mx-auto lg:grid-cols-2"
        : "grid-cols-1 max-w-sm mx-auto lg:max-w-none lg:grid-cols-3";

  return (
    <section className="testimonial-vintage bg-transparent py-4 sm:py-6 lg:py-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
        
          <h1 
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            Testimonal
          </h1>
        
          <p className="mt-2 text-2xl font-semibold text-gray-600 sm:mt-3 sm:text-2xl lg:text-3xl">
            What our clients say about us
          </p>
        </div>

        <div className="relative">
          {testimonials.length > perPage && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-lg shadow-sm transition hover:bg-gray-50 sm:left-1 lg:-left-2"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                aria-label="Previous testimonials"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-lg shadow-sm transition hover:bg-gray-50 sm:right-1 lg:-right-2"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                aria-label="Next testimonials"
              >
                ›
              </button>
            </>
          )}

          <div className={`grid gap-4 px-8 sm:px-10 lg:gap-5 lg:px-0 ${gridClass}`}>
            {visible.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id || `${page}-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>

          {testimonials.length > perPage && (
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === page ? "1.5rem" : "0.5rem",
                    background: i === page ? "var(--brand-dark)" : "var(--brand-lavender-soft)",
                  }}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

