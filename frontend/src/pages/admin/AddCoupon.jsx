import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const AddCoupon = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
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
      navigate("/admin/coupons");
    } catch (e) {
      console.error(e);
      setMessage("Failed to create coupon");
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
          onSubmit={submit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="code" className={labelClass} style={labelStyle}>
                Coupon Code *
              </label>
              <input
                id="code"
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. SAVE10"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="discountType" className={labelClass} style={labelStyle}>
                Discount Type
              </label>
              <select
                id="discountType"
                className={inputClass}
                style={inputStyle}
                value={form.discountType}
                onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value }))}
              >
                <option value="percent">Percentage</option>
                <option value="fixed">Price (₹)</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className={labelClass} style={labelStyle}>
                Discount Value *
              </label>
              <input
                id="discountValue"
                className={inputClass}
                style={inputStyle}
                type="number"
                placeholder={form.discountType === "percent" ? "e.g. 10" : "Amount in ₹"}
                value={form.discountValue}
                onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="minOrderAmount" className={labelClass} style={labelStyle}>
                Minimum Amount
              </label>
              <input
                id="minOrderAmount"
                className={inputClass}
                style={inputStyle}
                type="number"
                placeholder="Minimum order amount"
                value={form.minOrderAmount}
                onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="usageLimit" className={labelClass} style={labelStyle}>
                Usage Limit
              </label>
              <input
                id="usageLimit"
                className={inputClass}
                style={inputStyle}
                type="number"
                placeholder="0 = unlimited"
                value={form.usageLimit}
                onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="expiresAt" className={labelClass} style={labelStyle}>
                Expires At
              </label>
              <input
                id="expiresAt"
                className={inputClass}
                style={inputStyle}
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium" style={labelStyle}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-4 w-4 rounded"
              style={{ accentColor: "var(--brand-purple)" }}
            />
            Active
          </label>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "#3D294D" }}
            >
              {saving ? "Saving..." : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/coupons")}
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

export default AddCoupon;
