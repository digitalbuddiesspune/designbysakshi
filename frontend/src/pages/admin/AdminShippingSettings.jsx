import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminShippingSettings = () => {
  const [form, setForm] = useState({
    defaultShippingCharge: 50,
    freeShippingThreshold: 0,
    shippingNonRefundable: true,
  });
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/settings/shipping`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            defaultShippingCharge: Number(data.defaultShippingCharge ?? 50),
            freeShippingThreshold: Number(data.freeShippingThreshold ?? 0),
            shippingNonRefundable: data.shippingNonRefundable !== false,
          });
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load shipping settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings/shipping`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          defaultShippingCharge: Number(form.defaultShippingCharge || 0),
          freeShippingThreshold: Number(form.freeShippingThreshold || 0),
          shippingNonRefundable: Boolean(form.shippingNonRefundable),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.error || "Failed to save shipping settings");
        return;
      }
      setMessage("Shipping settings saved.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save shipping settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        Loading shipping settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Shipping Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Set the default shipping charge applied to every order (including COD). Shipping is
            non-refundable on returns. You can override shipping per order from Order Details.
          </p>
        </div>

        {message ? (
          <div
            className={`mb-6 rounded-md p-4 text-sm ${
              message.includes("saved")
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        ) : null}

        <form
          onSubmit={submit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white px-4 py-6 shadow-sm"
        >
          <div>
            <label htmlFor="defaultShippingCharge" className={labelClass} style={labelStyle}>
              Default Shipping Charge (₹) *
            </label>
            <input
              type="number"
              id="defaultShippingCharge"
              min="0"
              required
              value={form.defaultShippingCharge}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, defaultShippingCharge: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            />
            <p className="mt-1 text-xs text-gray-500">
              Charged on every order at checkout, including Cash on Delivery.
            </p>
          </div>

          <div>
            <label htmlFor="freeShippingThreshold" className={labelClass} style={labelStyle}>
              Free Shipping Above (₹)
            </label>
            <input
              type="number"
              id="freeShippingThreshold"
              min="0"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, freeShippingThreshold: e.target.value }))
              }
              className={inputClass}
              style={inputStyle}
            />
            <p className="mt-1 text-xs text-gray-500">
              Set to 0 to always charge shipping on every order.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.shippingNonRefundable}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shippingNonRefundable: e.target.checked }))
              }
            />
            Shipping charge is non-refundable on returns
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "#3D294D" }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminShippingSettings;
