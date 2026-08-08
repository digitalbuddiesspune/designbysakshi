import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);
  const [categories, setCategories] = useState([]);
  const emptyVariant = () => ({
    color: "",
    size: "",
    price: "",
    stock: "",
    images: [""],
  });

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    discountType: "",
    hsnCode: "",
    color: "",
    category: "",
    subcategory: "",
    description: "",
    inStock: true,
    stock: "",
    isBestseller: false,
    isNewArrival: false,
    latestCollectionSubcategory: "",
  });
  const [features, setFeatures] = useState([""]);
  const [stylingTips, setStylingTips] = useState([""]);
  const [variants, setVariants] = useState([]);
  // Additional image URLs (dynamically add up to 4)
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!editId) return;

    const loadProduct = async () => {
      setFetchingProduct(true);
      setMessage("");
      try {
        const response = await fetch(`${API_URL}/products/${editId}`);
        if (!response.ok) throw new Error("Product not found");
        const product = await response.json();
        const gallery =
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : [];
        const mainImage = gallery[0] || "";
        const extra = gallery.slice(1);

        setFormData({
          name: product.name || "",
          image: mainImage,
          price: product.price ?? "",
          discountType: product.discountType || "",
          hsnCode: product.hsnCode || "",
          color: product.color || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          description: product.description || "",
          inStock: product.inStock !== false,
          stock: product.stock ?? "",
          isBestseller: Boolean(product.isBestseller),
          isNewArrival: Boolean(product.isNewArrival),
          latestCollectionSubcategory: product.latestCollectionSubcategory || "",
        });
        setFeatures(product.features?.length ? product.features : [""]);
        setStylingTips(product.stylingTips?.length ? product.stylingTips : [""]);
        setVariants(
          Array.isArray(product.variants) && product.variants.length
            ? product.variants.map((v) => ({
                _id: v._id,
                color: v.color || "",
                size: v.size || "",
                price: v.price ?? "",
                stock: v.stock ?? "",
                images: Array.isArray(v.images) && v.images.length ? v.images : [""],
              }))
            : [],
        );
        setAdditionalImageUrls(extra.length ? extra : []);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setFetchingProduct(false);
      }
    };

    loadProduct();
  }, [editId]);

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

  const handleListChange = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAddListItem = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const handleRemoveListItem = (setter, index) => {
    setter((prev) => (prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index)));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    );
  };

  const updateVariantImage = (variantIndex, imageIndex, url) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== variantIndex) return variant;
        const images = [...(variant.images || [])];
        images[imageIndex] = url;
        return { ...variant, images };
      }),
    );
  };

  const addVariantImage = (variantIndex) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== variantIndex) return variant;
        const images = [...(variant.images || [])];
        if (images.length >= 4) return variant;
        return { ...variant, images: [...images, ""] };
      }),
    );
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== variantIndex) return variant;
        const images = (variant.images || []).filter((_, idx) => idx !== imageIndex);
        return { ...variant, images: images.length ? images : [""] };
      }),
    );
  };

  const inputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const inputStyle = {
    borderColor: "var(--brand-lavender-soft)",
    color: "var(--brand-dark)",
  };
  const labelClass = "block text-sm font-medium";
  const labelStyle = { color: "var(--brand-dark)" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10) || 0,
        hsnCode: String(formData.hsnCode || "").trim(),
        features: features.map((item) => item.trim()).filter(Boolean),
        stylingTips: stylingTips.map((item) => item.trim()).filter(Boolean),
        variants: variants
          .map((variant) => {
            const images = (variant.images || []).map((s) => (s || "").trim()).filter(Boolean);
            const price = parseFloat(variant.price);
            const stock = parseInt(variant.stock, 10) || 0;
            if (!Number.isFinite(price) || price < 0) return null;
            const payload = {
              color: String(variant.color || "").trim(),
              size: String(variant.size || "").trim(),
              price,
              stock,
              images,
            };
            if (variant._id) payload._id = variant._id;
            if (!payload.color && !payload.size && images.length === 0) return null;
            return payload;
          })
          .filter(Boolean),
      };

      // Remove subcategory if it's empty (categories like Bestseller/New Arrival have none)
      if (!productData.subcategory) {
        delete productData.subcategory;
      }

      // Build images gallery: include main `image` + optional extra URLs
      const extraImages = (additionalImageUrls || []).map((s) => (s || "").trim()).filter(Boolean);
      productData.images = [formData.image, ...extraImages];

      const response = await fetch(
        isEditMode ? `${API_URL}/products/${editId}` : `${API_URL}/products`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        },
      );

      if (response.ok) {
        setMessage(isEditMode ? "Product updated successfully!" : "Product added successfully!");
        setShowSuccessModal(true);
        if (!isEditMode) {
          setFormData({
            name: "",
            image: "",
            price: "",
            discountType: "",
            hsnCode: "",
            color: "",
            category: "",
            subcategory: "",
            description: "",
            inStock: true,
            stock: "",
            isBestseller: false,
            isNewArrival: false,
            latestCollectionSubcategory: "",
          });
          setFeatures([""]);
          setStylingTips([""]);
          setVariants([]);
          setAdditionalImageUrls([]);
        }
      } else {
        const error = await response.json();
        setMessage(
          `Error: ${error.error || (isEditMode ? "Failed to update product" : "Failed to add product")}`,
        );
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
  const featuredCategorySlugs = new Set(["bestseller", "new-arrival", "latest-collection"]);
  const mainCategories = categories.filter((cat) => !featuredCategorySlugs.has(cat.slug));
  const latestCollectionCategory = categories.find((cat) => cat.slug === "latest-collection");

  if (isEditMode && fetchingProduct) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
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
          className="rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6"
        >
          <div className="space-y-6">
            {/* Row 1: Name + Color */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass} style={labelStyle}>
                  Product Name *
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
                <label htmlFor="color" className={labelClass} style={labelStyle}>
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. Royal Purple"
                />
              </div>
            </div>

            {/* Row 2: Price + Discount Type + HSN */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className={labelClass} style={labelStyle}>
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
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="discountType" className={labelClass} style={labelStyle}>
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discountType"
                  name="discountType"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.discountType}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label htmlFor="hsnCode" className={labelClass} style={labelStyle}>
                  HSN Code
                </label>
                <input
                  type="text"
                  id="hsnCode"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. 7117"
                />
              </div>
            </div>

            {/* Row 3: Features + Styling Tips */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Features
                </label>
                <div className="mt-1 space-y-2">
                  {features.map((item, idx) => (
                    <div key={`feature-${idx}`} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange(setFeatures, idx, e.target.value)}
                        className={inputClass.replace("mt-1 ", "")}
                        style={inputStyle}
                        placeholder="e.g. Lightweight"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem(setFeatures, idx)}
                          className="shrink-0 px-2 text-xs font-semibold text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setFeatures)}
                    className="text-xs font-semibold hover:opacity-80"
                    style={{ color: "#3D294D" }}
                  >
                    + Add More
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  Styling Tips
                </label>
                <div className="mt-1 space-y-2">
                  {stylingTips.map((item, idx) => (
                    <div key={`tip-${idx}`} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange(setStylingTips, idx, e.target.value)}
                        className={inputClass.replace("mt-1 ", "")}
                        style={inputStyle}
                        placeholder="e.g. Pair with saree"
                      />
                      {stylingTips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem(setStylingTips, idx)}
                          className="shrink-0 px-2 text-xs font-semibold text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setStylingTips)}
                    className="text-xs font-semibold hover:opacity-80"
                    style={{ color: "#3D294D" }}
                  >
                    + Add More
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass} style={labelStyle}>
                  Main Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, subcategory: "" }));
                  }}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Select a category</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id || cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subcategory" className={labelClass} style={labelStyle}>
                  Subcategory {selectedCategory && selectedCategory.subcategories.length > 0 ? "*" : ""}
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  required={selectedCategory && selectedCategory.subcategories.length > 0}
                  disabled={!selectedCategory || selectedCategory.subcategories.length === 0}
                  value={formData.subcategory}
                  onChange={handleChange}
                  className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}
                  style={inputStyle}
                >
                  <option value="">
                    {!selectedCategory
                      ? "Select main category first"
                      : selectedCategory.subcategories.length === 0
                        ? "No subcategory available"
                        : "Select a subcategory"}
                  </option>
                  {selectedCategory?.subcategories.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured in special sections */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold" style={labelStyle}>
                Also show in
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={labelStyle}>
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: "var(--brand-purple)" }}
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm font-medium" style={labelStyle}>
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: "var(--brand-purple)" }}
                  />
                  New Arrival
                </label>
              </div>
              <div className="mt-4">
                <label htmlFor="latestCollectionSubcategory" className={labelClass} style={labelStyle}>
                  Latest Collection Subcategory (optional)
                </label>
                <select
                  id="latestCollectionSubcategory"
                  name="latestCollectionSubcategory"
                  value={formData.latestCollectionSubcategory}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Not in Latest Collection</option>
                  {latestCollectionCategory?.subcategories?.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Image + Stock */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <ImageUploader
                  label="Main Image *"
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="designbysakshi/products/main"
                />
                <div className="mt-3 space-y-3">
                  {additionalImageUrls.map((val, idx) => (
                    <div key={`extra-uploader-${idx}`} className="space-y-2">
                      <ImageUploader
                        label={`Additional Image ${idx + 1}`}
                        value={val}
                        onChange={(url) =>
                          setAdditionalImageUrls((prev) => prev.map((item, i) => (i === idx ? url : item)))
                        }
                        folder="designbysakshi/products/extra"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-xs font-semibold text-red-600 hover:opacity-90"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalImageUrls((prev) =>
                        prev.length >= 4 ? prev : [...prev, ""]
                      )
                    }
                    disabled={additionalImageUrls.length >= 4}
                    className="rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                    style={{ background: "#3D294D" }}
                  >
                    + Add Image
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="stock" className={labelClass} style={labelStyle}>
                    Main Stock (Quantity) *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Enter main product quantity"
                  />
                  {variants.length > 0 ? (
                    <p className="mt-1 text-xs" style={{ color: "var(--brand-muted)" }}>
                      Total stock (main + variants):{" "}
                      {(parseInt(formData.stock, 10) || 0) +
                        variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center pt-1">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: "var(--brand-purple)" }}
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm font-medium" style={labelStyle}>
                    In Stock
                  </label>
                </div>
              </div>
            </div>

            {/* Row 5: Description */}
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

            {/* Variants */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={labelStyle}>
                    Product Variants
                  </p>
                  <p className="text-xs" style={{ color: "var(--brand-muted)" }}>
                    Optional. Each variant has its own quantity, separate from main stock.
                    Admin product list shows main + all variant quantities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
                  className="rounded-md px-3 py-2 text-xs font-semibold text-white"
                  style={{ background: "#3D294D" }}
                >
                  + Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
                  No variants yet. Product will use the main price and images.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, vIdx) => (
                    <div
                      key={variant._id || `variant-${vIdx}`}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold" style={labelStyle}>
                          Variant {vIdx + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => setVariants((prev) => prev.filter((_, i) => i !== vIdx))}
                          className="text-xs font-semibold text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className={labelClass} style={labelStyle}>
                            Color
                          </label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(vIdx, "color", e.target.value)}
                            className={inputClass}
                            style={inputStyle}
                            placeholder="e.g. Gold"
                          />
                        </div>
                        <div>
                          <label className={labelClass} style={labelStyle}>
                            Size
                          </label>
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => updateVariant(vIdx, "size", e.target.value)}
                            className={inputClass}
                            style={inputStyle}
                            placeholder="e.g. Free Size"
                          />
                        </div>
                        <div>
                          <label className={labelClass} style={labelStyle}>
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={variant.price}
                            onChange={(e) => updateVariant(vIdx, "price", e.target.value)}
                            className={inputClass}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelClass} style={labelStyle}>
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            required
                            value={variant.stock}
                            onChange={(e) => updateVariant(vIdx, "stock", e.target.value)}
                            className={inputClass}
                            style={inputStyle}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="mt-3 space-y-3">
                        {(variant.images || []).map((img, imgIdx) => (
                          <div key={`variant-${vIdx}-img-${imgIdx}`} className="space-y-2">
                            <ImageUploader
                              label={`Variant Image ${imgIdx + 1}`}
                              value={img}
                              onChange={(url) => updateVariantImage(vIdx, imgIdx, url)}
                              folder="designbysakshi/products/variants"
                              compact
                            />
                            {(variant.images || []).length > 1 && (
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => removeVariantImage(vIdx, imgIdx)}
                                  className="text-xs font-semibold text-red-600"
                                >
                                  Remove image
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariantImage(vIdx)}
                          disabled={(variant.images || []).length >= 4}
                          className="text-xs font-semibold hover:opacity-80 disabled:opacity-40"
                          style={{ color: "#3D294D" }}
                        >
                          + Add Variant Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
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
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Product updated successfully" : "Product added successfully"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">Your product has been saved.</p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                if (isEditMode) navigate("/admin/products");
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

export default AdminAddProduct;
