import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 5,
    isActive: true
  });

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials/admin`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: "", review: "", rating: 5, isActive: true });
        fetchTestimonials();
      } else {
        alert("Failed to add testimonial");
      }
    } catch (error) {
      console.error("Error adding testimonial", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE"
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
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error toggling testimonial status", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Manage Testimonials</h1>
      
      {/* Add Testimonial Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Testimonial</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Review</label>
            <textarea 
              name="review" 
              value={formData.review} 
              onChange={handleChange} 
              required 
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border" 
            />
          </div>
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input 
                type="number" 
                name="rating" 
                value={formData.rating} 
                onChange={handleChange} 
                min="1" max="5" 
                required 
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border" 
              />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5" 
                />
                <span className="text-sm font-medium text-gray-700">Active (Visible on frontend)</span>
              </label>
            </div>
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Add Testimonial
          </button>
        </form>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">No testimonials found.</td></tr>
            ) : (
              testimonials.map(t => (
                <tr key={t._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{t.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{t.review}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-amber-500">{'★'.repeat(t.rating)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleActive(t._id, t.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {t.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:text-red-900">Delete</button>
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
