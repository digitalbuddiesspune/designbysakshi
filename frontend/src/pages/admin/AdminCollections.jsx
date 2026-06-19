import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminCollections = () => {
  const [items, setItems] = useState([]);

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
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API_URL}/collection-showcase/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/add-collection"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ background: "#3D294D" }}
        >
          + Add New Collection
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="px-5 py-4 text-left">Preview</th>
              <th className="px-5 py-4 text-left">Title</th>
              <th className="px-5 py-4 text-left">Route</th>
              <th className="px-5 py-4 text-left">Priority</th>
              <th className="px-5 py-4 text-left">Active</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                  No collections yet.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="border-t">
                  <td className="px-5 py-4">
                    <img src={it.image} alt={it.title} className="h-10 w-auto rounded" />
                  </td>
                  <td className="px-5 py-4">{it.title}</td>
                  <td className="px-5 py-4">{it.route}</td>
                  <td className="px-5 py-4">{it.priority ?? 0}</td>
                  <td className="px-5 py-4">{it.active ? "Yes" : "No"}</td>
                  <td className="px-5 py-4 space-x-2">
                    <Link
                      to={`/admin/edit-collection/${it._id}`}
                      className="text-sm font-semibold"
                      style={{ color: "#3D294D" }}
                    >
                      Edit
                    </Link>
                    <button type="button" onClick={() => remove(it._id)} className="text-sm font-semibold text-red-600">
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

export default AdminCollections;
