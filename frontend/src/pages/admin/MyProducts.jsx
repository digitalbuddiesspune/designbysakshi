import React, { useState, useEffect, useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editAdditionalImageUrls, setEditAdditionalImageUrls] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category summary
  const categorySummary = useMemo(() => {
    const summary = {};
    products.forEach((product) => {
      const cat = product.category || "Uncategorized";
      summary[cat] = (summary[cat] || 0) + 1;
    });
    return Object.entries(summary).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
      let isNumeric = false;
      switch (sortBy) {
        case "name":
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
        case "price":
          aVal = Number(a.price) || 0;
          bVal = Number(b.price) || 0;
          isNumeric = true;
          break;
        case "category":
          aVal = a.category?.toLowerCase() || "";
          bVal = b.category?.toLowerCase() || "";
          break;
        default:
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
      }

      if (isNumeric) {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: "base" });
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setEditFormData({ ...product });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const extraImages = (editAdditionalImageUrls || []).map((s) => (s || "").trim()).filter(Boolean);
      const images = [editFormData.image, ...extraImages];
      const response = await fetch(`${API_URL}/products/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editFormData,
          images,
          price: parseFloat(editFormData.price),
          stock: parseInt(editFormData.stock) || 0,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedProduct(null);
        setEditFormData({});
        setEditAdditionalImageUrls([""]);
        alert("Product updated successfully!");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
        if (selectedProduct?._id === id) {
          setIsModalOpen(false);
        }
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 sm:p-8">
      <h1
        className="mb-6 text-3xl font-medium"
        style={{
          color: "var(--brand-dark)",
          fontFamily: "Cormorant Garamond, Georgia, serif",
        }}
      >
        My Products
      </h1>

      {/* Category Summary */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--brand-dark)" }}>
          Category Summary
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === ""
                ? "text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={
              selectedCategory === ""
                ? {
                    background:
                      "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                  }
                : {}
            }
          >
            All ({products.length})
          </button>
          {categorySummary.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.name
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={
                selectedCategory === cat.name
                  ? {
                      background:
                        "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                    }
                  : {}
              }
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            style={{
              borderColor: "var(--brand-lavender-soft)",
              color: "var(--brand-dark)",
            }}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead style={{ background: "var(--brand-lavender-soft)" }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                        {product.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {product.category} / {product.subcategory}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleViewDetail(product)}
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="View Details"
                        >
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditFormData({ ...product });
                            // Initialize image gallery inputs for editor
                            const gallery = Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
                            const mainImage = gallery[0] || "";
                            const extra = gallery.slice(1);
                            setEditAdditionalImageUrls(extra.length > 0 ? extra : [""]);
                            setEditFormData((prev) => ({ ...prev, image: mainImage }));
                            setIsModalOpen(true);
                            setIsEditing(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-2xl font-medium"
                  style={{
                    color: "var(--brand-dark)",
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                  }}
                >
                  {isEditing ? "Edit Product" : "Product Details"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ""}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      value={editFormData.image || ""}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block text-sm font-medium">Additional Image URLs</label>
                      <button
                        type="button"
                        onClick={() => setEditAdditionalImageUrls((prev) => [...prev, ""])}
                        className="px-3 py-2 text-sm font-semibold rounded-md transition hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                          color: "white",
                        }}
                      >
                        + Add More Image
                      </button>
                    </div>
                    <div className="space-y-3">
                      {editAdditionalImageUrls.map((val, idx) => (
                        <div key={`edit-extra-${idx}`}>
                          <input
                            type="url"
                            value={val}
                            onChange={(e) => {
                              const next = e.target.value;
                              setEditAdditionalImageUrls((prev) => prev.map((item, i) => (i === idx ? next : item)));
                            }}
                            placeholder="Image link (https://...)"
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => setEditAdditionalImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                              className="mt-2 text-xs font-semibold text-red-600 hover:opacity-90"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price || ""}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount Type</label>
                      <input
                        type="text"
                        name="discountType"
                        value={editFormData.discountType || ""}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category || ""}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <input
                      type="text"
                      name="subcategory"
                      value={editFormData.subcategory || ""}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description || ""}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock (Quantity) *</label>
                      <input
                        type="number"
                        name="stock"
                        value={editFormData.stock || ""}
                        onChange={handleEditChange}
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={editFormData.inStock || false}
                        onChange={handleEditChange}
                        className="h-4 w-4"
                      />
                      <label className="text-sm font-medium">In Stock</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-semibold border rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-48 w-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/192";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
                    <p className="text-gray-600">
                      <strong>Category:</strong> {selectedProduct.category} / {selectedProduct.subcategory}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Price:</strong> {formatPrice(selectedProduct.price)}
                    </p>
                    {selectedProduct.discountType && (
                      <p className="text-gray-600 mt-1">
                        <strong>Discount:</strong> {selectedProduct.discountType}
                      </p>
                    )}
                    {selectedProduct.description && (
                      <p className="text-gray-600 mt-2">
                        <strong>Description:</strong> {selectedProduct.description}
                      </p>
                    )}
                    <p className="text-gray-600 mt-1">
                      <strong>Stock:</strong> {selectedProduct.stock || 0}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>In Stock:</strong> {selectedProduct.inStock ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
