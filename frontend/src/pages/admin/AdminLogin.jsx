import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user is admin
        if (data.user && data.user.role === "admin") {
          localStorage.setItem("user", JSON.stringify(data.user));
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          setMessage("Access denied. Admin role required.");
        }
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div 
        className="rounded-lg shadow-xl max-w-md w-full p-8"
        style={{
          background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-medium mb-2 text-white"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Admin Login
          </h1>
          <p className="text-white text-sm opacity-90">Enter your credentials to access the admin panel</p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-md p-4 ${
              message.includes("successful") || message.includes("Redirecting")
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            }`}
          >
            {message}
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-white"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  color: "var(--brand-dark)",
                }}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-red-200 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-white"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  color: "var(--brand-dark)",
                }}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-200 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50 bg-black hover:bg-gray-900"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
      </div>
    </div>
  );
};

export default AdminLogin;
