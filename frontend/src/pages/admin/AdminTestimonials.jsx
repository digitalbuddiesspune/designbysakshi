import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/testimonials/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching testimonials", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error deleting testimonial", error);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error toggling testimonial status", error);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/add-testimonial"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ background: "#3D294D" }}
        >
          + Add Testimonial
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Review</th>
              <th className="px-5 py-4 text-left">Rating</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>
                  Loading...
                </td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>
                  No testimonials found.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="px-5 py-4 font-semibold" style={{ color: "var(--brand-dark)" }}>
                    {t.name}
                  </td>
                  <td className="max-w-xs px-5 py-4 truncate" style={{ color: "var(--brand-muted)" }}>
                    {t.review}
                  </td>
                  <td className="px-5 py-4 text-amber-500">{"★".repeat(t.rating)}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(t._id, t.isActive)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        t.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(t._id)}
                      className="text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestimonials;
