import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subcategories: [],
    image: "",
    discountedPrice: "",
    priority: "",
    description: "",
  });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "", image: "", priority: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`);
      if (response.ok) {
        const category = await response.json();
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          subcategories: category.subcategories || [],
          image: category.image || "",
          discountedPrice: category.discountedPrice?.toString() || "",
          priority: category.priority?.toString() || "",
          description: category.description || "",
        });
      } else {
        setMessage("Error: Category not found");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setMessage("Error fetching category");
    } finally {
      setFetching(false);
    }
  };

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
    const name = (newSubcategory.name || "").trim();
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const subToAdd = {
        name,
        slug,
        ...(newSubcategory.image && { image: newSubcategory.image }),
        ...(newSubcategory.priority !== "" && { priority: parseInt(newSubcategory.priority) || 0 }),
      };
      setFormData((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, subToAdd],
      }));
      setNewSubcategory({ name: "", slug: "", image: "", priority: "" });
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
      const normalizeSlug = (value) =>
        String(value || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      // Normalize subcategories to ensure backend required fields exist.
      const normalizedSubcategories = Array.isArray(formData.subcategories)
        ? formData.subcategories
            .map((s) => {
              const name = String(s?.name || "").trim();
              const slug = String(s?.slug || "").trim() || normalizeSlug(name);
              if (!name || !slug) return null;
              return {
                name,
                slug,
                ...(s?.image ? { image: s.image } : {}),
                ...(Number.isFinite(s?.priority) ? { priority: s.priority } : { priority: 0 }),
              };
            })
            .filter(Boolean)
        : [];

      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        subcategories: normalizedSubcategories,
        ...(formData.image && { image: formData.image }),
        ...(formData.discountedPrice && {
          discountedPrice: parseFloat(formData.discountedPrice),
        }),
        ...(formData.priority && { priority: parseInt(formData.priority) }),
        ...(formData.description && { description: formData.description }),
        timestamp: true,
      };

      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        setMessage("Category updated successfully!");
        setTimeout(() => {
          navigate("/admin/categories");
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || "Failed to update category"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 sm:p-8">
        <div className="text-center py-12">Loading category...</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1
        className="mb-8 text-3xl font-medium"
        style={{
          color: "var(--brand-dark)",
          fontFamily: "Cormorant Garamond, Georgia, serif",
        }}
      >
        Edit Category
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

        {/* Discounted Price - Required */}
        <div>
          <label
            htmlFor="discountedPrice"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Discounted Price (₹) *
          </label>
          <input
            type="number"
            id="discountedPrice"
            name="discountedPrice"
            required
            min="0"
            step="0.01"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--brand-dark)" }}
          >
            Priority (Lower number = Higher priority)
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
            placeholder="0 = highest priority"
          />
        </div>

        {/* Subcategories */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-dark)" }}>
            Subcategories
          </label>
          <div className="space-y-3">
            {formData.subcategories.map((sub, index) => (
              <div key={index} className="space-y-2 p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => {
                        const copy = { ...prev };
                        copy.subcategories[index].name = v;
                        copy.subcategories[index].slug = v
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        return copy;
                      });
                    }}
                    className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                    placeholder="Subcategory Name"
                    style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                {formData.slug === "latest-collection" && null}
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              {formData.slug === "latest-collection" && (
                null
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="mt-2 px-4 py-2 text-sm font-medium text-white rounded-md transition"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
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
              background:
                "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
            }}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-3 text-sm font-semibold rounded-md border transition"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
