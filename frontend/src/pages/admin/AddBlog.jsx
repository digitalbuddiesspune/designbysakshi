import React, { useEffect, useState } from "react";
import ImageUploader from "../../components/admin/ImageUploader";

const API_URL = import.meta.env.VITE_API_URL;

const AddBlog = () => {
  const emptyForm = { title: "", bloggerName: "", image: "", content: "" };
  const [formData, setFormData] = useState({
    title: "",
    bloggerName: "",
    image: "",
    content: "",
  });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBlogs, setFetchingBlogs] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const fetchBlogs = async () => {
    try {
      setFetchingBlogs(true);
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Error: Failed to fetch blogs");
    } finally {
      setFetchingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const isEdit = Boolean(editingId);
      const res = await fetch(isEdit ? `${API_URL}/blogs/${editingId}` : `${API_URL}/blogs`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error || data.message || "Failed to save blog"}`);
        return;
      }

      setMessage(isEdit ? "Blog updated successfully!" : "Blog added successfully!");
      setFormData(emptyForm);
      setEditingId("");
      setShowForm(false);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || "",
      bloggerName: blog.bloggerName || "",
      image: blog.image || "",
      content: blog.content || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error || data.message || "Failed to delete blog"}`);
        return;
      }
      setMessage("Blog deleted successfully!");
      await fetchBlogs();
      if (editingId === id) {
        setEditingId("");
        setFormData(emptyForm);
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1
          className="mb-6 text-center text-3xl font-medium sm:text-4xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Manage Blogs
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

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId("");
                setFormData(emptyForm);
              } else {
                setShowForm(true);
              }
            }}
            className="rounded-md px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)" }}
          >
            {showForm ? "Close Form" : "Add Blog"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 space-y-6 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--brand-lavender-soft)" }}>
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

            <div className="space-y-3">
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
              <p className="text-xs" style={{ color: "var(--brand-muted)" }}>
                Or upload from files:
              </p>
              <ImageUploader
                label="Drag & Drop Blog Image"
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url || "" }))}
                folder="designbysakshi/blogs"
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

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                }}
              >
                {loading ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId("");
                  setFormData(emptyForm);
                  setShowForm(false);
                }}
                className="rounded-md border px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "var(--brand-lavender-soft)" }}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead style={{ background: "var(--brand-pastel)" }}>
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Image</th>
                  <th className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Title</th>
                  <th className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Blogger</th>
                  <th className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Date</th>
                  <th className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchingBlogs ? (
                  <tr>
                    <td className="px-4 py-8 text-sm" colSpan={5} style={{ color: "var(--brand-muted)" }}>
                      Loading blogs...
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-sm" colSpan={5} style={{ color: "var(--brand-muted)" }}>
                      No blogs added yet.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="border-t" style={{ borderColor: "var(--brand-lavender-soft)" }}>
                      <td className="px-4 py-3">
                        <img src={blog.image} alt={blog.title} className="h-12 w-16 rounded object-cover" />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                        {blog.title}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--brand-dark)" }}>
                        {blog.bloggerName || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--brand-muted)" }}>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(blog)}
                            className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                            style={{ borderColor: "var(--brand-purple)", color: "var(--brand-purple)" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog._id)}
                            className="rounded-md border px-3 py-1.5 text-xs font-semibold text-red-600 border-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;

