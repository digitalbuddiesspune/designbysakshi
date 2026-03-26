import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
        <h1 
            className="text-3xl lg:text-4xl font-semibold text-center" 
            style={{ 
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif" 
            }}>
            Blog
          </h1>
          <p
            className="mx-auto max-w-2xl text-center text-3xl font-medium sm:text-4xl"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Stories, care tips, and new inspirations
          </p>

          {loading ? (
            <div className="mt-12 text-center text-sm" style={{ color: "var(--brand-muted)" }}>
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="mt-12 text-center rounded-2xl border bg-white px-6 py-12" style={{ color: "var(--brand-muted)" }}>
              <p className="text-lg font-semibold" style={{ color: "var(--brand-dark)" }}>
                No blogs yet
              </p>
              <p className="mt-2 text-sm">Please check back soon.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
                  style={{ textDecoration: "none" }}
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>

                  <div className="p-5">
                    <h2
                      className="mb-2 text-lg font-semibold"
                      style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {blog.title}
                    </h2>
                    {blog.bloggerName ? (
                      <div
                        className="mb-3 text-xs font-medium inline-block px-2.5 py-1 rounded-full"
                        style={{ background: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                      >
                        By {blog.bloggerName}
                      </div>
                    ) : null}
                    <p className="text-sm leading-relaxed" style={{ color: "var(--brand-muted)" }}>
                      {formatExcerpt(blog.content)}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--brand-purple)" }}>
                      Read more →
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

