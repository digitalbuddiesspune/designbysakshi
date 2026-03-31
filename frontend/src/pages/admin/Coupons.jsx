import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrderAmount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/coupons`);
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch coupons failed:", e);
      setCoupons([]);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        appliesTo: "all",
        usageLimit: Number(form.usageLimit || 0),
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive,
      };
      const res = await fetch(`${API_URL}/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.message || "Failed to create coupon");
        return;
      }
      setForm(emptyForm);
      setMessage("Coupon created");
      fetchCoupons();
    } catch (e) {
      console.error(e);
      setMessage("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (coupon) => {
    try {
      await fetch(`${API_URL}/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      fetchCoupons();
    } catch (e) {
      console.error("Toggle coupon failed:", e);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await fetch(`${API_URL}/coupons/${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (e) {
      console.error("Delete coupon failed:", e);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-medium mb-6" style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}>
        Coupons
      </h1>

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Coupon code name (e.g. SAVE10)" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} required />
        <select className="rounded-lg border px-3 py-2 text-sm" value={form.discountType} onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value }))}>
          <option value="percent">Percentage</option>
          <option value="fixed">Price (₹)</option>
        </select>
        <input className="rounded-lg border px-3 py-2 text-sm" type="number" placeholder={form.discountType === "percent" ? "Percentage (e.g. 10)" : "Price amount (₹)"} value={form.discountValue} onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))} required />
        <input className="rounded-lg border px-3 py-2 text-sm" type="number" placeholder="Minimum amount" value={form.minOrderAmount} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))} />
        <input className="rounded-lg border px-3 py-2 text-sm" type="number" placeholder="Usage limit (0 = unlimited)" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} />
        <input className="rounded-lg border px-3 py-2 text-sm" type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
          Active
        </label>
        <button type="submit" disabled={saving} className="rounded-lg bg-[#3D294D] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
          {saving ? "Saving..." : "Create Coupon"}
        </button>
      </form>
      {message ? <div className="mb-4 text-sm" style={{ color: "var(--brand-dark)" }}>{message}</div> : null}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="text-left px-5 py-4">Code</th>
              <th className="text-left px-5 py-4">Discount</th>
              <th className="text-left px-5 py-4">Applies To</th>
              <th className="text-left px-5 py-4">Usage</th>
              <th className="text-left px-5 py-4">Status</th>
              <th className="text-left px-5 py-4">Expires</th>
              <th className="text-left px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-5 py-4 font-semibold">{c.code}</td>
                <td className="px-5 py-4">{c.discountType === "percent" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="px-5 py-4">all</td>
                <td className="px-5 py-4">{c.usedCount}/{c.usageLimit || "∞"}</td>
                <td className="px-5 py-4">{c.isActive ? "Active" : "Inactive"}</td>
                <td className="px-5 py-4">{c.expiresAt ? new Date(c.expiresAt).toLocaleString("en-IN") : "-"}</td>
                <td className="px-5 py-4 flex gap-2">
                  <button type="button" className="rounded border px-3 py-1 text-xs" onClick={() => toggleStatus(c)}>
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                  <button type="button" className="rounded border px-3 py-1 text-xs text-red-600" onClick={() => remove(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">No coupons yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
