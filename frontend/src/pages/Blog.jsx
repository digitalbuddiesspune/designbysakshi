import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/blogs`);
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatExcerpt = (content) => {
    const text = (content || "").replace(/\s+/g, " ").trim();
    if (text.length <= 140) return text;
    return `${text.slice(0, 140)}...`;
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#f2f0ec" }}>
      <section className="w-full">
        <div className="flex h-[150px] items-center justify-center bg-black sm:hidden">
          <h1
            className="text-5xl font-semibold tracking-[0.08em]"
            style={{ color: "#ffffff", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            THE BLOG
          </h1>
        </div>
        <img
          src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774592546/Untitled_1920_x_500_px_e5ielu.svg"
          alt="Blog banner"
          className="hidden h-[180px] w-full object-cover sm:block sm:h-[240px] md:h-[320px] lg:h-[390px]"
        />
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
         

          {loading ? (
            <div className="py-10 text-center text-sm" style={{ color: "var(--brand-muted)" }}>
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-lg border bg-white px-6 py-12 text-center" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <p className="text-lg font-semibold" style={{ color: "var(--brand-dark)" }}>
                No blogs yet
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--brand-muted)" }}>
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className={`group w-full ${
                    blogs.length === 1
                      ? "col-span-2 mx-auto max-w-[300px] lg:col-span-3"
                      : "max-w-none lg:mx-auto lg:max-w-[300px]"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="relative">
                    <div className="h-[185px] w-full overflow-hidden bg-white sm:h-[220px]">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  
                  </div>

                  <div className="px-2 pt-4 text-center">
                    <h2
                      className="mx-auto max-w-[260px] text-[24px] leading-[1.08] sm:text-[28px] lg:text-[33px]"
                      style={{ color: "#262626", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {blog.title}
                    </h2>
                    <p className="mx-auto mt-2 max-w-[260px] text-[12px] leading-5 sm:mt-3 sm:text-[13px] sm:leading-6" style={{ color: "#474747" }}>
                      {formatExcerpt(blog.content)}
                    </p>
                    <div className="mt-4 text-center">
                      <span
                        className="inline-block text-[16px] italic"
                        style={{ color: "#2f2f2f", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                      >
                        Read More
                      </span>
                      <span className="ml-2 inline-block text-base" style={{ color: "#2f2f2f" }}>
                        &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;

