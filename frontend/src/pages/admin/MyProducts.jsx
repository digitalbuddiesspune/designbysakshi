import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminPagination, { ADMIN_PAGE_SIZE } from "../../components/admin/AdminPagination.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const REVIEW_FILTER_KEY = "__with_reviews__";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const onStockUpdated = () => {
      fetchProducts();
    };
    window.addEventListener("product-stock-updated", onStockUpdated);
    return () => window.removeEventListener("product-stock-updated", onStockUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate category summary
  const categorySummary = useMemo(() => {
    const summary = {};
    products.forEach((product) => {
      const cat = product.category || "Uncategorized";
      summary[cat] = (summary[cat] || 0) + 1;
    });
    return Object.entries(summary).map(([name, count]) => ({ name, count }));
  }, [products]);

  const productsWithReviewsCount = useMemo(
    () =>
      products.filter(
        (product) => Array.isArray(product.userReviews) && product.userReviews.length > 0,
      ).length,
    [products],
  );

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          String(p.hsnCode || "").toLowerCase().includes(q),
      );
    }

    // Filter by category
    if (selectedCategory) {
      if (selectedCategory === REVIEW_FILTER_KEY) {
        filtered = filtered.filter(
          (p) => Array.isArray(p.userReviews) && p.userReviews.length > 0,
        );
      } else {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (selectedCategory === REVIEW_FILTER_KEY) {
        const aReviews = Array.isArray(a.userReviews) ? a.userReviews.length : 0;
        const bReviews = Array.isArray(b.userReviews) ? b.userReviews.length : 0;
        if (aReviews !== bReviews) return bReviews - aReviews;
      }
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

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ADMIN_PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ADMIN_PAGE_SIZE;
    return filteredAndSortedProducts.slice(start, start + ADMIN_PAGE_SIZE);
  }, [filteredAndSortedProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
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
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory(REVIEW_FILTER_KEY)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === REVIEW_FILTER_KEY
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Product Reviews ({productsWithReviewsCount})
          </button>
          {categorySummary.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.name
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
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
            placeholder="Search by name, category, or HSN..."
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
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
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
                      <div className="text-sm text-gray-600">{product.color || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
                    </td>
                  <td className="px-4 py-3">
                    <div className="text-sm" style={{ color: product.stock > 0 ? "var(--brand-dark)" : "#ef4444" }}>
                      {Number.isFinite(product.stock) ? product.stock : 0}
                    </div>
                  </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => navigate(`/admin/products/${product._id}`)}
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
                          onClick={() => navigate(`/admin/edit-product/${product._id}`)}
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
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedProducts.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyProducts;
