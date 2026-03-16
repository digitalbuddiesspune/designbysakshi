import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length !== 2) {
      return "Name must contain exactly 2 words";
    }
    if (words.some((word) => word.length < 3)) {
      return "Each word must have at least 3 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (phone && !/^[9876]\d{9}$/.test(phone)) {
      return "Phone must start with 9, 8, 7, or 6 and be 10 digits";
    }
    if (phone && phone.length !== 10) {
      return "Phone number must be exactly 10 digits";
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
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        ...formData,
        role: "user", // Always default to user
      };
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
        setShowToast(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in"
          style={{
            backgroundColor: "#000000",
            color: "var(--brand-lavender)",
          }}
        >
          <p className="text-sm font-medium">Successfully login</p>
        </div>
      )}

      <div className="min-h-screen flex items-start justify-center py-2 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-4">
            <h2
              className="text-2xl font-medium"
              style={{
                color: "var(--brand-dark)",
                fontFamily: "Cormorant Garamond, Georgia, serif",
              }}
            >
              Sign Up
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
            {/* Name and Phone on one line */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Name (2 words, each min 3 chars) *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.name
                      ? "#ef4444"
                      : "var(--brand-lavender-soft)",
                    color: "var(--brand-dark)",
                  }}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Phone Number (starts with 9, 8, 7, or 6)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  style={{
                    borderColor: errors.phone
                      ? "#ef4444"
                      : "var(--brand-lavender-soft)",
                    color: "var(--brand-dark)",
                  }}
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Must contain uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--brand-dark)" }}
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                style={{
                  borderColor: errors.confirmPassword
                    ? "#ef4444"
                    : "var(--brand-lavender-soft)",
                  color: "var(--brand-dark)",
                }}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                }}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm"
                style={{ color: "var(--brand-purple)" }}
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
