import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  name: "",
  review: "",
  rating: 5,
  isActive: true,
};

const AddTestimonial = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const inputStyle = {
    borderColor: "var(--brand-lavender-soft)",
    color: "var(--brand-dark)",
  };
  const labelClass = "block text-sm font-medium";
  const labelStyle = { color: "var(--brand-dark)" };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const response = await fetch(`${API_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setMessage("Failed to add testimonial");
        return;
      }
      navigate("/admin/testimonials");
    } catch (error) {
      console.error("Error adding testimonial", error);
      setMessage("Failed to add testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {message ? (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-800">{message}</div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6"
        >
          <div>
            <label htmlFor="name" className={labelClass} style={labelStyle}>
              Customer Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="review" className={labelClass} style={labelStyle}>
              Review *
            </label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
              rows="4"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rating" className={labelClass} style={labelStyle}>
                Rating (1-5) *
              </label>
              <input
                id="rating"
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium" style={labelStyle}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--brand-purple)" }}
                />
                Active (visible on frontend)
              </label>
            </div>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {saving ? "Saving..." : "Add Testimonial"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/testimonials")}
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

export default AddTestimonial;
