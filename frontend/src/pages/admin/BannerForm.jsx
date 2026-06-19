import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  title: "",
  imageDesktop: "",
  imageMobile: "",
  link: "",
  priority: 0,
  active: true,
  startsAt: "",
  endsAt: "",
};

const BannerForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
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
    if (!id) return;
    const loadBanner = async () => {
      try {
        setFetching(true);
        const res = await fetch(`${API_URL}/banners?includeInactive=true`);
        const data = await res.json();
        const banner = Array.isArray(data) ? data.find((item) => item._id === id) : null;
        if (!banner) throw new Error("Banner not found");
        setForm({
          title: banner.title || "",
          imageDesktop: banner.imageDesktop || "",
          imageMobile: banner.imageMobile || "",
          link: banner.link || "",
          priority: banner.priority ?? 0,
          active: Boolean(banner.active),
          startsAt: banner.startsAt ? new Date(banner.startsAt).toISOString().slice(0, 16) : "",
          endsAt: banner.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : "",
        });
      } catch (error) {
        setMessage(error.message || "Failed to load banner");
      } finally {
        setFetching(false);
      }
    };
    loadBanner();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        priority: Number(form.priority) || 0,
        startsAt: form.startsAt ? new Date(form.startsAt) : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt) : undefined,
      };
      const res = await fetch(isEditMode ? `${API_URL}/banners/${id}` : `${API_URL}/banners`, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(isEditMode ? "Failed to update banner" : "Failed to create banner");
      navigate("/admin/banners");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Loading banner...
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
            <label htmlFor="title" className={labelClass} style={labelStyle}>
              Title (optional)
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              style={inputStyle}
              placeholder="Banner title"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUploader
              label="Desktop Image *"
              value={form.imageDesktop}
              onChange={(url) => setForm({ ...form, imageDesktop: url })}
              folder="designbysakshi/banners"
            />
            <ImageUploader
              label="Mobile Image (optional)"
              value={form.imageMobile}
              onChange={(url) => setForm({ ...form, imageMobile: url })}
              folder="designbysakshi/banners"
            />
          </div>

          <div>
            <label htmlFor="link" className={labelClass} style={labelStyle}>
              Link (optional)
            </label>
            <input
              id="link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className={inputClass}
              style={inputStyle}
              placeholder="/shop or full URL"
            />
          </div>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startsAt" className={labelClass} style={labelStyle}>
                Starts At
              </label>
              <input
                id="startsAt"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="endsAt" className={labelClass} style={labelStyle}>
                Ends At
              </label>
              <input
                id="endsAt"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {loading ? "Saving..." : isEditMode ? "Update Banner" : "Create Banner"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/banners")}
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

export default BannerForm;
