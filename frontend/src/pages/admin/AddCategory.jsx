import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subcategories: [],
    image: "",
    priority: "",
    description: "",
  });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const inputStyle = {
    borderColor: "var(--brand-lavender-soft)",
    color: "var(--brand-dark)",
  };
  const labelClass = "block text-sm font-medium";
  const labelStyle = { color: "var(--brand-dark)" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.name.trim() && newSubcategory.slug.trim()) {
      setFormData((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, { ...newSubcategory }],
      }));
      setNewSubcategory({ name: "", slug: "" });
    }
  };

  const handleRemoveSubcategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        subcategories: formData.subcategories,
        ...(formData.image && { image: formData.image }),
        ...(formData.priority && { priority: parseInt(formData.priority) }),
        ...(formData.description && { description: formData.description }),
        timestamp: true,
      };

      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        setMessage("Category added successfully!");
        setShowSuccessModal(true);
        setFormData({
          name: "",
          slug: "",
          subcategories: [],
          image: "",
          priority: "",
          description: "",
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || "Failed to add category"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {message && (
          <div
            className={`mb-6 rounded-md p-4 ${
              message.includes("Error")
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass} style={labelStyle}>
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="slug" className={labelClass} style={labelStyle}>
                Slug (auto-generated)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`${inputClass} bg-gray-50`}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>
              Subcategories
            </label>
            <div className="mt-2 space-y-3">
              {formData.subcategories.map((sub, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <span className="text-sm">
                    {sub.name} ({sub.slug})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(index)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} style={labelStyle}>
                    Category
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.name || "—"}
                    className={`${inputClass} bg-gray-50`}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    placeholder="New subcategory name"
                    value={newSubcategory.name}
                    onChange={(e) =>
                      setNewSubcategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, ""),
                      }))
                    }
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "#3D294D" }}
              >
                + Add Subcategory
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUploader
              label="Category Image (optional)"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              folder="designbysakshi/categories"
              compact
            />
            <div>
              <label htmlFor="priority" className={labelClass} style={labelStyle}>
                Priority
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                min="0"
                value={formData.priority}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="0 = highest priority"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass} style={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="rounded-md border px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{ borderColor: "#3D294D", color: "#3D294D" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Category added successfully</h3>
            <p className="mt-2 text-sm text-gray-600">Your category has been saved.</p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/admin/categories");
              }}
              className="mt-5 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
