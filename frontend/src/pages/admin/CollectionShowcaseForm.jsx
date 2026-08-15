import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  title: "",
  image: "",
  route: "",
  priority: 0,
  active: true,
};

const CollectionShowcaseForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [allowedRoutes, setAllowedRoutes] = useState([]);
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
    const loadAllowedRoutes = async () => {
      try {
        const res = await fetch(`${API_URL}/collection-showcase/allowed-routes`);
        const data = await res.json();
        setAllowedRoutes(Array.isArray(data) ? data : []);
      } catch {
        setAllowedRoutes([]);
      }
    };
    loadAllowedRoutes();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadItem = async () => {
      try {
        setFetching(true);
        const res = await fetch(`${API_URL}/collection-showcase?includeInactive=true`);
        const data = await res.json();
        const item = Array.isArray(data) ? data.find((entry) => entry._id === id) : null;
        if (!item) throw new Error("Collection not found");
        setForm({
          title: item.title || "",
          image: item.image || "",
          route: item.route || "",
          priority: item.priority ?? 0,
          active: Boolean(item.active),
        });
      } catch (error) {
        setMessage(error.message || "Failed to load collection");
      } finally {
        setFetching(false);
      }
    };
    loadItem();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = { ...form, priority: Number(form.priority) || 0 };
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(
        isEditMode ? `${API_URL}/collection-showcase/${id}` : `${API_URL}/collection-showcase`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || (isEditMode ? "Failed to update collection" : "Failed to create collection"));
      }
      navigate("/admin/collections-showcase");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Loading collection...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {message ? (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-800">{message}</div>
        ) : null}

        <form
          onSubmit={submit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6"
        >
          <div>
            <label htmlFor="route" className={labelClass} style={labelStyle}>
              Collection *
            </label>
            <select
              id="route"
              value={form.route}
              onChange={(e) => {
                const selectedRoute = e.target.value;
                const found = allowedRoutes.find((r) => r.route === selectedRoute);
                setForm((prev) => ({
                  ...prev,
                  route: selectedRoute,
                  title: found?.name || prev.title,
                }));
              }}
              className={inputClass}
              style={inputStyle}
              required
            >
              <option value="">Select latest-collection subcategory</option>
              {allowedRoutes.map((r) => (
                <option key={r.route || r.slug} value={r.route}>
                  {r.name || r.slug || r.route}
                </option>
              ))}
            </select>
          </div>

          <ImageUploader
            label="Thumbnail Image *"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="designbysakshi/collections"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className={labelClass} style={labelStyle}>
                Priority
              </label>
              <input
                id="priority"
                type="number"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className={inputClass}
                style={inputStyle}
                placeholder="Higher number shows first"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium" style={labelStyle}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--brand-purple)" }}
                />
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {loading ? "Saving..." : isEditMode ? "Update Collection" : "Create Collection"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/collections-showcase")}
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

export default CollectionShowcaseForm;
