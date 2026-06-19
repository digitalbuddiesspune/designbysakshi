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
    priority: "",
    description: "",
  });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "", image: "", priority: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const inputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const inputStyle = {
    borderColor: "var(--brand-lavender-soft)",
    color: "var(--brand-dark)",
  };
  const labelClass = "block text-sm font-medium";
  const labelStyle = { color: "var(--brand-dark)" };

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
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Loading category...
      </div>
    );
  }

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
                <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Subcategory Name</label>
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData((prev) => {
                            const copy = { ...prev, subcategories: [...prev.subcategories] };
                            copy.subcategories[index] = {
                              ...copy.subcategories[index],
                              name: v,
                              slug: v
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, ""),
                            };
                            return copy;
                          });
                        }}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Subcategory Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Subcategory Slug</label>
                      <input
                        type="text"
                        value={sub.slug}
                        readOnly
                        className={`${inputClass} bg-gray-100`}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(index)}
                    className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
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
                Priority (Lower number = Higher priority)
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
              {loading ? "Updating..." : "Update Category"}
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
    </div>
  );
};

export default EditCategory;
