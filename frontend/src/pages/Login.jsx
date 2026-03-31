import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ isModal = false, onClose, onSwitchSignup }) => {
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

    // Validation
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
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        setTimeout(() => {
          window.dispatchEvent(new Event("auth-changed"));
          if (isModal) {
            onClose?.();
          } else {
            navigate("/");
            window.location.reload();
          }
        }, 1000);
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/35 backdrop-blur-sm px-4">
      <div className="max-w-md w-full">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6">
          <button
            type="button"
            onClick={() => {
              if (isModal) {
                onClose?.();
              } else {
                navigate("/");
              }
            }}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close login modal"
          >
            ×
          </button>
          <div className="text-center mb-4">
            <h2
              className="text-2xl font-medium"
              style={{
                color: "var(--brand-dark)",
                fontFamily: "Cormorant Garamond, Georgia, serif",
              }}
            >
              Login
            </h2>
          </div>

          {message && (
            <div
              className={`mb-6 rounded-md p-4 ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--brand-dark)" }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                style={{
                  borderColor: errors.email
                    ? "#ef4444"
                    : "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--brand-dark)" }}
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500" : ""
                }`}
                style={{
                  borderColor: errors.password
                    ? "#ef4444"
                    : "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
                style={{
                  background: "#3D294D",
                }}
              >
                {loading ? "Processing..." : "Login"}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  if (isModal) {
                    onSwitchSignup?.();
                  } else {
                    navigate("/signup");
                  }
                }}
                className="text-sm"
                style={{ color: "var(--brand-purple)" }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
