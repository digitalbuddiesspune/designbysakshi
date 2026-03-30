import React, { useEffect, useState } from "react";
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
  endsAt: ""
};

const AdminBanners = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/banners?includeInactive=true`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        priority: Number(form.priority) || 0,
        startsAt: form.startsAt ? new Date(form.startsAt) : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt) : undefined
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/banners/${editingId}` : `${API_URL}/banners`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (_e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const edit = (it) => {
    setEditingId(it._id);
    setForm({
      title: it.title || "",
      imageDesktop: it.imageDesktop || "",
      imageMobile: it.imageMobile || "",
      link: it.link || "",
      priority: it.priority ?? 0,
      active: Boolean(it.active),
      startsAt: it.startsAt ? new Date(it.startsAt).toISOString().slice(0, 16) : "",
      endsAt: it.endsAt ? new Date(it.endsAt).toISOString().slice(0, 16) : ""
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`${API_URL}/banners/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-4">Homepage Banners</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border p-4 space-y-3 lg:col-span-1">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (optional)" className="w-full border rounded px-3 py-2" />
          <ImageUploader
            label="Desktop Image"
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
          <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link (optional)" className="w-full border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="Priority (higher first)" className="w-full border rounded px-3 py-2" />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="w-full border rounded px-3 py-2" />
            <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-3">
            <button disabled={loading} className="rounded bg-purple-600 px-4 py-2 text-white">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded border px-4 py-2">Cancel</button>
            )}
          </div>
        </form>
        <div className="lg:col-span-2 bg-white rounded-xl border p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Preview</th>
                <th className="py-2">Title</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-b">
                  <td className="py-2">
                    <img src={it.imageDesktop || it.imageMobile} alt={it.title} className="h-10 w-auto" />
                  </td>
                  <td className="py-2">{it.title}</td>
                  <td className="py-2">{it.priority ?? 0}</td>
                  <td className="py-2">{it.active ? "Yes" : "No"}</td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => edit(it)} className="text-purple-700">Edit</button>
                    <button onClick={() => remove(it._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;

