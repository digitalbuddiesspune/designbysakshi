import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const paragraphs = useMemo(() => {
    const raw = blog?.content || "";
    // Split by new lines and keep non-empty lines as paragraphs
    return raw
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [blog]);

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-pastel)" }}>
      <section className="px-4 py-0 pb-24 sm:px-6 sm:py-1 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2">
            <div className="mb-2">
              <Link
                to="/blog"
                className="text-sm font-medium no-underline transition hover:opacity-80"
                style={{ color: "var(--brand-dark)" }}
              >
                ← Back to Blog
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
          {loading ? (
            <div className="rounded-2xl border bg-white p-6 text-center" style={{ color: "var(--brand-muted)" }}>
              Loading...
            </div>
          ) : !blog ? (
            <div className="rounded-2xl border bg-white p-6 text-center" style={{ color: "var(--brand-muted)" }}>
              Blog not found.
            </div>
          ) : (
            <article className="rounded-2xl overflow-hidden bg-white shadow-sm border">
              <div className="relative h-72 bg-gray-100">
                <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
              </div>

              <div className="p-6 sm:p-8">
                <h1
                  className="text-3xl sm:text-4xl font-medium"
                  style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  {blog.title}
                </h1>

                {blog.bloggerName ? (
                  <div
                    className="mt-3 text-sm"
                    style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    By <span style={{ color: "var(--brand-purple)", fontWeight: 600 }}>{blog.bloggerName}</span>
                  </div>
                ) : null}

                <div className="mt-4 text-sm" style={{ color: "var(--brand-muted)" }}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : ""}
                </div>

                <div className="mt-8 space-y-4 leading-relaxed text-base" style={{ color: "var(--brand-muted)" }}>
                  {paragraphs.map((p, idx) => (
                    <p key={`${idx}-${p.slice(0, 20)}`}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;

