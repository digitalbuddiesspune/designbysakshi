import React, { useEffect, useState } from "react";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  title: "",
  image: "",
  route: "",
  priority: 0,
  active: true
};

const AdminCollections = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/collection-showcase?includeInactive=true`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
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

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = { ...form, priority: Number(form.priority) || 0 };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/collection-showcase/${editingId}` : `${API_URL}/collection-showcase`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
      try {
        const allowedRes = await fetch(`${API_URL}/collection-showcase/allowed-routes`);
        const allowedData = await allowedRes.json();
        setAllowedRoutes(Array.isArray(allowedData) ? allowedData : []);
      } catch {
        // ignore
      }
      setMessage("Saved successfully!");
    } catch (_e) {
      const err = _e instanceof Error ? _e : new Error("Failed");
      setMessage(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const edit = (it) => {
    setEditingId(it._id);
    setForm({
      title: it.title || "",
      image: it.image || "",
      route: it.route || "",
      priority: it.priority ?? 0,
      active: Boolean(it.active)
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${API_URL}/collection-showcase/${id}`, { method: "DELETE" });
    await load();
    try {
      const allowedRes = await fetch(`${API_URL}/collection-showcase/allowed-routes`);
      const allowedData = await allowedRes.json();
      setAllowedRoutes(Array.isArray(allowedData) ? allowedData : []);
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-4">Shop By Collection (Homepage)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border p-4 space-y-3 lg:col-span-1">
          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.toLowerCase().includes("saved") || message.toLowerCase().includes("success")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
          <select
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
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select latest-collection subcategory</option>
            {allowedRoutes.map((r) => (
              <option key={r.route || r.slug} value={r.route}>
                {r.name || r.slug || r.route}
              </option>
            ))}
          </select>
          <ImageUploader
            label="Thumbnail Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="designbysakshi/collections"
          />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="Priority (higher first)" className="w-full border rounded px-3 py-2" />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
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
                <th className="py-2">Route</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-b">
                  <td className="py-2">
                    <img src={it.image} alt={it.title} className="h-10 w-auto" />
                  </td>
                  <td className="py-2">{it.title}</td>
                  <td className="py-2">{it.route}</td>
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

export default AdminCollections;

