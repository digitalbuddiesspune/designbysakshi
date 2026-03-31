import React, { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [qtySort, setQtySort] = useState("desc");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/admin`);
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sortedUsers = useMemo(() => {
    const arr = [...users];
    arr.sort((a, b) => {
      const qa = Number(a?.totalQuantityPurchased || 0);
      const qb = Number(b?.totalQuantityPurchased || 0);
      return qtySort === "asc" ? qa - qb : qb - qa;
    });
    return arr;
  }, [users, qtySort]);

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}? This will delete user data, orders, cart and wishlist.`)) return;
    try {
      const res = await fetch(`${API_URL}/users/admin/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error(error);
      alert("Unable to delete user");
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1
          className="text-3xl font-medium mb-2"
          style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Users
        </h1>
        <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
          {users.length} users
        </p>
        <div className="mt-3">
          <label className="text-xs font-semibold mr-2" style={{ color: "var(--brand-muted)" }}>
            Sort by Qty Purchased
          </label>
          <select
            value={qtySort}
            onChange={(e) => setQtySort(e.target.value)}
            className="rounded-lg border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
              <th className="text-left px-5 py-4">Name</th>
              <th className="text-left px-5 py-4">Email</th>
              <th className="text-left px-5 py-4">Phone</th>
              <th className="text-left px-5 py-4">Address</th>
              <th className="text-left px-5 py-4">Orders</th>
              <th className="text-left px-5 py-4">Qty Purchased</th>
              <th className="text-left px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center" style={{ color: "var(--brand-muted)" }}>
                  No users found
                </td>
              </tr>
            ) : (
              sortedUsers.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-5 py-4 font-semibold" style={{ color: "var(--brand-dark)" }}>{u.name}</td>
                  <td className="px-5 py-4" style={{ color: "var(--brand-dark)" }}>{u.email}</td>
                  <td className="px-5 py-4" style={{ color: "var(--brand-dark)" }}>{u.phone || "-"}</td>
                  <td className="px-5 py-4 max-w-xs">
                    <span className="line-clamp-2" style={{ color: "var(--brand-muted)" }}>{u.address}</span>
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--brand-dark)" }}>{u.totalOrders}</td>
                  <td className="px-5 py-4" style={{ color: "var(--brand-dark)" }}>{u.totalQuantityPurchased}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => deleteUser(u._id, u.name)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
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

export default Users;

