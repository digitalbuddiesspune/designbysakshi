import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    bloggerName: "",
    image: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error || data.message || "Failed to add blog"}`);
        return;
      }

      setMessage("Blog added successfully!");
      setFormData({ title: "", bloggerName: "", image: "", content: "" });
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-6 text-center text-3xl font-medium sm:text-4xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Add Blog
        </h1>

        {message && (
          <div
            className={`mb-6 rounded-md p-4 ${
              message.toLowerCase().includes("error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
              Blog Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            />
          </div>

          <div>
            <label
              htmlFor="bloggerName"
              className="block text-sm font-medium"
              style={{ color: "var(--brand-dark)" }}
            >
              Blogger Name *
            </label>
            <input
              id="bloggerName"
              name="bloggerName"
              type="text"
              required
              value={formData.bloggerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
              Image URL *
            </label>
            <input
              id="image"
              name="image"
              type="url"
              required
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
              Blog Content *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
              }}
            >
              {loading ? "Adding..." : "Add Blog"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-md border px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;

