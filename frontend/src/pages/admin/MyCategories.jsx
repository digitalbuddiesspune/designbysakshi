import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MyCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setExpandedSubcategories({});
      }
    };

    if (Object.keys(expandedSubcategories).length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedSubcategories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      // Sort by priority (lower number = higher priority, comes first)
      const sorted = data.sort((a, b) => {
        const priorityA = a.priority || 999;
        const priorityB = b.priority || 999;
        return priorityA - priorityB;
      });
      setCategories(sorted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c._id !== id));
        alert("Category deleted successfully!");
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  const toggleSubcategories = (categoryId) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
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
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-medium"
          style={{
            color: "var(--brand-dark)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
          }}
        >
          My Categories
        </h1>
        <Link
          to="/admin/add-category"
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition"
          style={{
            background: "#000000",
          }}
        >
          + Add Category
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No categories found.</p>
          <Link
            to="/admin/add-category"
            className="inline-block px-4 py-2 text-sm font-semibold text-white rounded-lg transition"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
            }}
          >
            Add Your First Category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full border-collapse">
              <thead style={{ background: "var(--brand-lavender-soft)" }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Category Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Subcategories
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Discounted Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => {
                  const isExpanded = expandedSubcategories[category._id];
                  const firstSubcategory =
                    category.subcategories && category.subcategories.length > 0
                      ? category.subcategories[0]
                      : null;
                  const hasMoreSubcategories =
                    category.subcategories && category.subcategories.length > 1;

                  return (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Slug: {category.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-12 rounded object-cover border"
                            style={{ borderColor: "var(--brand-lavender-soft)" }}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => toggleSubcategories(category._id)}
                              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                              <span>{firstSubcategory?.name || "No subcategories"}</span>
                              {hasMoreSubcategories && (
                                <>
                                  <span className="text-xs text-gray-500">
                                    (+{category.subcategories.length - 1} more)
                                  </span>
                                  <svg
                                    className={`w-4 h-4 transition-transform ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </>
                              )}
                            </button>
                            {isExpanded && hasMoreSubcategories && (
                              <div className="absolute left-0 top-full mt-1 z-10 bg-white border rounded-md shadow-lg min-w-[200px] py-2">
                                {category.subcategories.map((sub, index) => (
                                  <div
                                    key={index}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    {sub.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No subcategories</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {category.priority !== undefined ? category.priority : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {category.discountedPrice !== undefined
                            ? formatPrice(category.discountedPrice)
                            : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit-category/${category._id}`)}
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
                            onClick={() => handleDelete(category._id)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCategories;
