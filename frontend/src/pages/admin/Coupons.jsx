import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

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
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/add-coupon"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ background: "#3D294D" }}
        >
          + Create Coupon
        </Link>
      </div>

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
                <td className="px-5 py-4">
                  {c.discountType === "percent" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                </td>
                <td className="px-5 py-4">all</td>
                <td className="px-5 py-4">
                  {c.usedCount}/{c.usageLimit || "∞"}
                </td>
                <td className="px-5 py-4">{c.isActive ? "Active" : "Inactive"}</td>
                <td className="px-5 py-4">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-5 py-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded border px-3 py-1 text-xs"
                    onClick={() => toggleStatus(c)}
                  >
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    className="rounded border px-3 py-1 text-xs text-red-600"
                    onClick={() => remove(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">
                  No coupons yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
