import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    if (phone && !/^9876\d{6}$/.test(phone)) {
      return "Phone must start with 9876 and be 10 digits";
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

    // Clear error for this field
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

    if (isLogin) {
      // Login validation
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
          setMessage("Login successful!");
          setTimeout(() => {
            onLogin(data.user);
            onClose();
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              role: "user",
            });
          }, 1000);
        } else {
          setMessage(data.error || "Login failed");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Signup validation
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

      if (!formData.role) {
        newErrors.role = "Role is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setMessage("Signup successful!");
          setTimeout(() => {
            onLogin(data.user);
            onClose();
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              role: "user",
            });
          }, 1000);
        } else {
          setMessage(data.error || "Signup failed");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-medium"
              style={{
                color: "var(--brand-dark)",
                fontFamily: "Cormorant Garamond, Georgia, serif",
              }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-md p-3 ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    Phone Number (starts with 9876)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.phone
                        ? "#ef4444"
                        : "var(--brand-lavender-soft)",
                      color: "var(--brand-dark)",
                    }}
                    placeholder="9876123456"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.role ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.role
                        ? "#ef4444"
                        : "var(--brand-lavender-soft)",
                      color: "var(--brand-dark)",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
                className="block text-sm font-medium mb-1"
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Must contain uppercase, lowercase, and number
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
                style={{
                  background: "#3D294D",
                }}
              >
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setMessage("");
                }}
                className="text-sm"
                style={{ color: "var(--brand-purple)" }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
