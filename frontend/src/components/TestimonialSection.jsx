import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || testimonials.length === 0) return null;

  // Dynamic justifyment to center items if they are fewer than max columns for current breakpoint
  const justifyClass = `
    ${testimonials.length <= 1 ? 'justify-center' : 'justify-start'}
    ${testimonials.length <= 2 ? 'sm:justify-center' : 'sm:justify-start'}
    ${testimonials.length <= 4 ? 'lg:justify-center' : 'lg:justify-start'}
  `;

  return (
    <section className="relative bg-white py-6 sm:py-8 lg:py-10 overflow-hidden">
      <style>
        {`
          @keyframes testimonialGradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      {/* Decorative background blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-white opacity-60 z-0 mix-blend-multiply pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-6">
          <h2
            className="text-4xl font-medium sm:text-5xl"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            What Our Customers Say
          </h2>
          <div className="mt-2 flex animate-pulse justify-center">
             <div className="h-1 w-16 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"></div>
          </div>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Real experiences from our beautiful customers who chose to shine with our jewelry.
          </p>
        </div>

        <div className="flex w-full">
          <div 
            className={`flex w-full gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 px-2 ${justifyClass}`}
            style={{ scrollBehavior: 'smooth' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id || index}
                className="relative flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] snap-center bg-white border border-gray-100 p-5 sm:p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Animated gradient + subtle SVG pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(197,162,215,0.35), rgba(61,41,77,0.12), rgba(16,185,129,0.22))",
                      backgroundSize: "200% 200%",
                      animation: "testimonialGradientShift 10s ease-in-out infinite",
                    }}
                  />
                  <svg
                    className="absolute inset-0 h-full w-full opacity-25"
                    viewBox="0 0 240 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id={`testimonial-dots-${index}`}
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="4" cy="4" r="1.4" fill="rgba(61,41,77,0.55)" />
                        <circle cx="16" cy="16" r="1.1" fill="rgba(197,162,215,0.45)" />
                      </pattern>
                    </defs>
                    <rect width="240" height="160" fill={`url(#testimonial-dots-${index})`} />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-6 drop-shadow-sm">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-amber-400" : "text-gray-200"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="relative">
                    <svg className="absolute -top-4 -left-3 h-8 w-8 text-purple-100 transform -scale-x-100 z-0" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="relative z-10 text-gray-700 font-medium mb-4 leading-relaxed tracking-wide min-h-[3.5rem]">
                      "{testimonial.review}"
                    </p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center gap-4 mt-auto pt-3 border-t border-gray-100">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-inner transition-transform group-hover:scale-110" style={{background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)"}}>
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem" }}>{testimonial.name}</h4>
                    <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
