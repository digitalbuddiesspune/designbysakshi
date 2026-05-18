import React, { useState, useEffect, useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const DESKTOP_VISIBLE = 4;
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

const NameDivider = ({ name }) => (
  <div className="mt-4 flex w-full items-center justify-center gap-2 px-1">
    <span className="h-px w-10 flex-1 max-w-[48px]" style={{ background: PURPLE.divider }} />
    <h3 className="shrink-0 text-base font-bold sm:text-lg" style={{ color: PURPLE.text }}>
      {name}
    </h3>
    <span className="h-px w-10 flex-1 max-w-[48px]" style={{ background: PURPLE.divider }} />
  </div>
);

const HeartDivider = () => (
  <div className="mx-auto flex w-full max-w-[130px] items-center justify-center gap-2 sm:max-w-[150px]">
    <span className="h-px flex-1" style={{ background: PURPLE.divider }} />
    <HeartIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" filled style={{ color: PURPLE.light }} />
    <span className="h-px flex-1" style={{ background: PURPLE.divider }} />
  </div>
);

const ReviewText = ({ review, fullReview = false, onReadMore }) => {
  const textRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (fullReview) return undefined;

    const el = textRef.current;
    if (!el) return undefined;

    const checkClamp = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };

    checkClamp();
    const observer = new ResizeObserver(checkClamp);
    observer.observe(el);
    return () => observer.disconnect();
  }, [review, fullReview]);

  if (fullReview) {
    return (
      <div className="mx-auto w-full max-w-full overflow-y-auto px-0.5">
        <p
          className="text-sm font-bold leading-relaxed sm:text-base lg:text-base"
          style={{ color: "var(--brand-muted)" }}
        >
          {review}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-full flex-col sm:h-[5.75rem] lg:h-[6rem]">
      <p
        ref={textRef}
        className="line-clamp-3 h-[4.25rem] shrink-0 overflow-hidden text-[17px] font-bold leading-[1.4] sm:h-auto sm:text-lg sm:leading-relaxed lg:text-base"
        style={{ color: "var(--brand-muted)" }}
      >
        {review}
      </p>
      <div className="flex h-5 shrink-0 items-center justify-center gap-1">
        {isClamped && (
          <>
            <span className="text-xs font-bold sm:text-xs" style={{ color: PURPLE.light }} aria-hidden="true">
              ...
            </span>
            <button
              type="button"
              onClick={onReadMore}
              className="text-xs font-semibold sm:text-xs"
              style={{ color: PURPLE.text }}
            >
              read more
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const TestimonialPaperBody = ({ testimonial, fullReview = false, onReadMore, overlayClassName = "" }) => {
  const rating = testimonial.rating > 0 ? testimonial.rating : 5;

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col px-[11%] pb-[10%] pt-[20%] text-center sm:px-[10%] sm:pb-[12%] sm:pt-[22%] lg:px-[9%] lg:pb-[14%] lg:pt-[20%] ${overlayClassName}`}
    >
      <div className="flex h-10 shrink-0 items-end justify-center sm:h-auto sm:block">
        <span
          className="block text-4xl leading-none sm:text-6xl lg:text-5xl"
          style={{ color: PURPLE.quote, fontFamily: "Cormorant Garamond, Georgia, serif" }}
          aria-hidden="true"
        >
          &ldquo;
        </span>
      </div>

      <div
        className={`flex h-[5.75rem] shrink-0 items-start justify-center pt-0.5 sm:flex-1 sm:min-h-0 sm:h-auto sm:pt-1.5 ${
          fullReview ? "sm:overflow-hidden" : ""
        }`}
      >
        <ReviewText review={testimonial.review} fullReview={fullReview} onReadMore={onReadMore} />
      </div>

      <div className="w-full shrink-0 space-y-1.5 pb-0.5 sm:space-y-1 sm:pb-0">
        <div className="mt-2 sm:mt-0">
          <HeartDivider />
        </div>

        <h3
          className="flex h-7 items-center justify-center text-base font-bold sm:h-auto sm:text-xl lg:text-base"
          style={{ color: PURPLE.text }}
        >
          {testimonial.name}
        </h3>

        <p
          className="flex h-6 items-center justify-center gap-1 text-sm font-semibold sm:h-auto sm:text-base lg:text-sm"
          style={{ color: PURPLE.light }}
        >
          Happy Client
          <HeartIcon className="h-3 w-3" style={{ color: PURPLE.light }} />
        </p>

        <div
          className="flex h-6 items-center justify-center gap-0.5 sm:h-auto sm:pt-0.5"
          aria-label={`${rating} out of 5 stars`}
        >
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-4 w-4 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5"
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
    </div>
  );
};

const TestimonialModal = ({ testimonial, onClose }) => {
  useEffect(() => {
    if (!testimonial) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow || "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [testimonial, onClose]);

  if (!testimonial) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-20 z-[1990] flex items-center justify-center bg-black/90 px-4 py-4 top-16 md:bottom-0 md:top-[112px] lg:top-[144px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[min(100%,360px)] sm:max-w-[380px]"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="testimonial-modal-title" className="sr-only">
          Full testimonial from {testimonial.name}
        </p>
        <article className="relative w-full">
          <img
            src={PAPER_CARD_IMG}
            alt=""
            className="block max-h-[68vh] w-full object-contain drop-shadow-2xl"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-[3%] top-[3%] z-20 flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium leading-none text-white shadow-md transition hover:opacity-90 sm:h-9 sm:w-9"
            style={{ background: PURPLE.text }}
            aria-label="Close testimonial"
          >
            ×
          </button>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[12%] py-[18%] text-center">
            <p
              className="scrollbar-hide max-h-[42vh] w-full overflow-y-auto text-sm font-bold leading-relaxed sm:text-base"
              style={{ color: "var(--brand-muted)" }}
            >
              {testimonial.review}
            </p>
            <NameDivider name={testimonial.name} />
          </div>
        </article>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial, onReadMore }) => {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,330px)] sm:max-w-[260px] lg:max-w-none">
      <article className="relative w-full">
        <img
          src={PAPER_CARD_IMG}
          alt=""
          className="block w-full h-auto drop-shadow-md"
          aria-hidden="true"
        />
        <TestimonialPaperBody testimonial={testimonial} onReadMore={() => onReadMore(testimonial)} />
      </article>
    </div>
  );
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateVisibleCount = () => setVisibleCount(media.matches ? DESKTOP_VISIBLE : 1);
    updateVisibleCount();
    media.addEventListener("change", updateVisibleCount);
    return () => media.removeEventListener("change", updateVisibleCount);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
  }, [visibleCount]);

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

  const maxSlideIndex = Math.max(0, testimonials.length - visibleCount);
  const totalSlides = testimonials.length > visibleCount ? maxSlideIndex + 1 : 1;
  const safeSlideIndex = Math.min(slideIndex, maxSlideIndex);

  const visible = testimonials.slice(safeSlideIndex, safeSlideIndex + visibleCount);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i >= maxSlideIndex ? 0 : i + 1));
  }, [maxSlideIndex]);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i <= 0 ? maxSlideIndex : i - 1));
  }, [maxSlideIndex]);

  useEffect(() => {
    if (totalSlides <= 1 || expandedTestimonial) return undefined;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [totalSlides, goNext, expandedTestimonial]);

  useEffect(() => {
    if (slideIndex > maxSlideIndex) setSlideIndex(maxSlideIndex);
  }, [slideIndex, maxSlideIndex]);

  if (loading || testimonials.length === 0) return null;

  const canSlide = testimonials.length > visibleCount;

  return (
    <section className="bg-transparent py-4 sm:py-6 lg:py-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 pt-2 text-center sm:mb-4 sm:pt-4 lg:pt-6">
          <h1
            className="text-center text-3xl font-semibold lg:text-4xl"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Testimonal
          </h1>

          <p className="mt-2 text-2xl font-semibold text-gray-600 sm:mt-3 sm:text-2xl lg:text-3xl">
            What our clients say about us
          </p>
        </div>

        <div className="relative">
          {canSlide && (
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

          <div
            className={`-mt-2 grid items-stretch gap-4 px-4 sm:px-10 lg:mt-0 lg:gap-3 lg:px-2 xl:gap-4 xl:px-0 ${
              visibleCount === 1
                ? "mx-auto max-w-[min(100%,360px)] grid-cols-1 sm:max-w-sm"
                : "mx-auto max-w-none grid-cols-1 lg:grid-cols-4"
            }`}
          >
            {visible.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                onReadMore={setExpandedTestimonial}
              />
            ))}
          </div>

          {canSlide && (
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === safeSlideIndex ? "1.5rem" : "0.5rem",
                    background:
                      i === safeSlideIndex ? "var(--brand-dark)" : "var(--brand-lavender-soft)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {expandedTestimonial && (
        <TestimonialModal
          testimonial={expandedTestimonial}
          onClose={() => setExpandedTestimonial(null)}
        />
      )}
    </section>
  );
};

export default TestimonialSection;
