import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const getLocalUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AdminProfile = () => {
  const [adminUser, setAdminUser] = useState(() => getLocalUser());

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setProfileLoading(true);
        const parsed = getLocalUser();
        if (parsed?.email) {
          setAdminUser((prev) => ({
            ...(prev || {}),
            email: parsed.email,
            role: parsed.role || prev?.role || "admin",
          }));
        }

        const token = localStorage.getItem("token");
        let loaded = false;

        if (token) {
          const res = await fetch(`${API_URL}/users/admin/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            setAdminUser(data);
            loaded = true;
          } else if (res.status !== 401 && res.status !== 403) {
            // Only show unexpected errors; 401/403 can happen with old sessions.
            setIsError(true);
            setMessage(data.error || "Failed to load admin profile");
          }
        }

        if (!loaded) {
          const fallbackRes = await fetch(`${API_URL}/users/admin/account`);
          const fallbackData = await fallbackRes.json().catch(() => ({}));
          if (fallbackRes.ok) {
            setAdminUser(fallbackData);
            loaded = true;
            setIsError(false);
            setMessage("");
          } else {
            // If route is unavailable (404), keep local user email silently.
            if (fallbackRes.status !== 404 && fallbackRes.status !== 401 && fallbackRes.status !== 403) {
              setIsError(true);
              setMessage(fallbackData.error || "Failed to load admin profile");
            }
          }
        }
      } catch (error) {
        // Keep the screen usable; show only if no local admin data exists.
        if (!adminUser?.email) {
          setIsError(true);
          setMessage(error.message || "Failed to load admin profile");
        }
      } finally {
        setProfileLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setIsError(true);
      setMessage("All fields are required");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setIsError(true);
      setMessage("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to change password");
        return;
      }
      setMessage("Password updated successfully");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1
        className="mb-6 text-3xl font-medium"
        style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
      >
        Admin Profile
      </h1>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Admin Details</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-gray-800"><span className="font-semibold">Email:</span> {profileLoading ? "Loading..." : (adminUser?.email || "-")}</p>
          <p className="text-gray-800"><span className="font-semibold">Role:</span> {profileLoading ? "Loading..." : (adminUser?.role || "-")}</p>
          <p className="text-gray-800"><span className="font-semibold">Password:</span> ********</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl rounded-xl border bg-white p-5 shadow-sm space-y-4">
        {message ? (
          <div className={`rounded-md px-4 py-3 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message}
          </div>
        ) : null}

        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-gray-800">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-800">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-800">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;

