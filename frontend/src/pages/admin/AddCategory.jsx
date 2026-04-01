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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
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

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <div className="p-6 sm:p-8">
      <h1
        className="mb-8 text-3xl font-medium"
        style={{
          color: "var(--brand-dark)",
          fontFamily: "Cormorant Garamond, Georgia, serif",
        }}
      >
        Add Category
      </h1>

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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Category Name - Required */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>

        {/* Slug (auto-generated) */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Slug (auto-generated)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 bg-gray-50"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>

        {/* Subcategories */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-dark)" }}>
            Subcategories
          </label>
          <div className="space-y-3">
            {formData.subcategories.map((sub, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <span className="flex-1 text-sm">
                  {sub.name} ({sub.slug})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubcategory(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Subcategory Name"
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
                className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition"
                style={{
                  background: "#111111",
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Image - Optional */}
        <div>
          <ImageUploader
            label="Category Image (optional)"
            value={formData.image}
            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
            folder="designbysakshi/categories"
          />
        </div>

        {/* Priority - Optional */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Priority
          </label>
          <input
            type="number"
            id="priority"
            name="priority"
            min="0"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>

        {/* Description - Optional */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 text-sm font-semibold text-white rounded-md transition disabled:opacity-50"
            style={{
              background: "#16a34a",
            }}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-3 text-sm font-semibold rounded-md border transition"
            style={{
              borderColor: "#111111",
              color: "#111111",
            }}
          >
            Cancel
          </button>
        </div>
      </form>

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
