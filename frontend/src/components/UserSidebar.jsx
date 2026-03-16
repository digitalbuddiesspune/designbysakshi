import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserSidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="w-64 bg-white border-r shadow-sm min-h-screen p-6" style={{ borderColor: "var(--brand-lavender-soft)" }}>
      <div className="space-y-2">
        <Link
          to="/profile"
          className={`block px-4 py-3 rounded-lg transition ${
            location.pathname === "/profile"
              ? "bg-purple-100 font-semibold"
              : "hover:bg-gray-50"
          }`}
          style={{
            color: location.pathname === "/profile" ? "var(--brand-purple)" : "var(--brand-dark)",
          }}
        >
          Profile
        </Link>
        <Link
          to="/orders"
          className={`block px-4 py-3 rounded-lg transition ${
            location.pathname === "/orders"
              ? "bg-purple-100 font-semibold"
              : "hover:bg-gray-50"
          }`}
          style={{
            color: location.pathname === "/orders" ? "var(--brand-purple)" : "var(--brand-dark)",
          }}
        >
          My Orders
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg transition hover:bg-red-50 text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
