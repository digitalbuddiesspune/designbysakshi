import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    discountType: "",
    category: "",
    subcategory: "",
    description: "",
    inStock: true,
    stock: "",
  });
  // Additional image URLs (comma-separated input is replaced by dynamic boxes)
  const [additionalImageUrls, setAdditionalImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
      };

      // Remove subcategory if it's empty (categories like Bestseller/New Arrival have none)
      if (!productData.subcategory) {
        delete productData.subcategory;
      }

      // Build images gallery: include main `image` + optional extra URLs
      const extraImages = (additionalImageUrls || []).map((s) => (s || "").trim()).filter(Boolean);
      productData.images = [formData.image, ...extraImages];

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        setShowSuccessModal(true);
        setFormData({
          name: "",
          image: "",
          price: "",
          discountType: "",
          category: "",
          subcategory: "",
          description: "",
          inStock: true,
          stock: "",
        });
        setAdditionalImageUrls([""]);
        // Stay on the same page, don't redirect
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || "Failed to add product"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.slug === formData.category
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-8 text-center text-3xl font-medium sm:text-4xl"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          Add New Product
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium"
              style={{ color: "var(--brand-dark)" }}
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--brand-lavender-soft)",
                color: "var(--brand-dark)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium"
              style={{ color: "var(--brand-dark)" }}
            >
              Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--brand-lavender-soft)",
                color: "var(--brand-dark)",
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="additionalImageUrls" className="block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                Additional Image URLs
              </label>
              <button
                type="button"
                onClick={() => setAdditionalImageUrls((prev) => [...prev, ""])}
                className="px-3 py-2 text-sm font-semibold rounded-md transition hover:opacity-90"
                style={{
                  background: "#111111",
                  color: "white",
                }}
              >
                + Add More Image
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {additionalImageUrls.map((val, idx) => (
                <div key={`extra-image-${idx}`}>
                  <input
                    type="url"
                    value={val}
                    onChange={(e) => {
                      const next = e.target.value;
                      setAdditionalImageUrls((prev) => prev.map((item, i) => (i === idx ? next : item)));
                    }}
                    placeholder="Image link (https://...)"
                    className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--brand-lavender-soft)",
                      color: "var(--brand-dark)",
                    }}
                  />

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      className="mt-2 text-xs font-semibold text-red-600 hover:opacity-90"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                Discount Type (e.g. 10% OFF)
              </label>
              <input
                type="text"
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                Main Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={(e) => {
                  // when main category changes, also reset subcategory
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, subcategory: "" }));
                }}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                Subcategory {selectedCategory && selectedCategory.subcategories.length > 0 ? "*" : ""}
              </label>
              <select
                id="subcategory"
                name="subcategory"
                required={selectedCategory && selectedCategory.subcategories.length > 0}
                disabled={!selectedCategory || (selectedCategory && selectedCategory.subcategories.length === 0)}
                value={formData.subcategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-400"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
              >
                <option value="">
                  {!selectedCategory
                    ? "Select main category first"
                    : selectedCategory.subcategories.length === 0
                    ? "No subcategory available"
                    : "Select a subcategory"}
                </option>
                {selectedCategory &&
                  selectedCategory.subcategories.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium"
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
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--brand-lavender-soft)",
                color: "var(--brand-dark)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                Stock (Quantity) *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
                placeholder="Enter stock quantity"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded"
                style={{ accentColor: "var(--brand-purple)" }}
              />
              <label
                htmlFor="inStock"
                className="ml-2 text-sm font-medium"
                style={{ color: "var(--brand-dark)" }}
              >
                In Stock
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{
                background: "#16a34a",
              }}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-md border px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{
                borderColor: "#111111",
                color: "#111111",
              }}
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
            <h3 className="text-xl font-semibold text-gray-900">Product added successfully</h3>
            <p className="mt-2 text-sm text-gray-600">Your product has been saved.</p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
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

export default AdminAddProduct;
