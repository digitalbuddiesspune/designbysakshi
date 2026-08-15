import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { ShieldCheckIcon, KeyIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Require Security Code verification every time Admin Login is accessed
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [verifyingSecurity, setVerifyingSecurity] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleVerifySecurityCode = async (e) => {
    e.preventDefault();
    setSecurityError("");

    if (!securityCode.trim()) {
      setSecurityError("Please enter the security code");
      return;
    }

    setVerifyingSecurity(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-security-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: securityCode.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSecurityVerified(true);
      } else {
        setSecurityError(data.error || "Invalid security code. Access denied.");
      }
    } catch (error) {
      setSecurityError("Failed to verify security code. Please check backend connection.");
    } finally {
      setVerifyingSecurity(false);
    }
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
      const response = await fetch(`${API_URL}/auth/admin-login`, {
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
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("token", data.token);
        }
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
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

  // STEP 1: Show Security Code Gate FIRST
  if (!isSecurityVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl text-white border border-white/10"
          style={{ background: "var(--brand-dark)" }}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 text-amber-300">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              Security Authorization Required
            </h2>
            <p className="text-sm text-gray-300">
              Enter the security code to access the Admin Login page.
            </p>
          </div>

          {securityError && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-200 text-center font-medium">
              {securityError}
            </div>
          )}

          <form onSubmit={handleVerifySecurityCode} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Security Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyIcon className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter security code"
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyingSecurity}
              className="w-full py-3 px-4 font-semibold text-sm rounded-xl transition bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 shadow-md"
            >
              {verifyingSecurity ? "Verifying..." : "Verify & Access Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition underline underline-offset-4"
            >
              Cancel & Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Show Admin Login Form ONLY AFTER Security Code is Verified
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className="rounded-xl shadow-2xl max-w-md w-full p-8 transition-all"
        style={{ background: "var(--brand-dark)" }}
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
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              style={{
                color: "var(--brand-dark)",
                borderColor: errors.password ? "#ef4444" : "#d1d5db",
                background: "#ffffff",
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
            className="w-full px-6 py-3 text-sm font-semibold rounded-lg transition disabled:opacity-50 bg-white hover:opacity-95"
            style={{ color: "var(--brand-dark)" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
