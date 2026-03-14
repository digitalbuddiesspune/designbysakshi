import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
      // Note: You'll need to create an update user endpoint in the backend
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-8">
        <div className="max-w-2xl">
          <h1
            className="text-3xl font-medium mb-8"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            Profile
          </h1>

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

          <div className="bg-white rounded-lg shadow-md p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-muted)" }}>
                    Name
                  </label>
                  <p className="text-lg" style={{ color: "var(--brand-dark)" }}>
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-muted)" }}>
                    Email
                  </label>
                  <p className="text-lg" style={{ color: "var(--brand-dark)" }}>
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-muted)" }}>
                    Phone Number
                  </label>
                  <p className="text-lg" style={{ color: "var(--brand-dark)" }}>
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                  }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.name ? "#ef4444" : "var(--brand-lavender-soft)",
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
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.email ? "#ef4444" : "var(--brand-lavender-soft)",
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
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    style={{
                      borderColor: errors.phone ? "#ef4444" : "var(--brand-lavender-soft)",
                      color: "var(--brand-dark)",
                    }}
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                      });
                      setErrors({});
                      setMessage("");
                    }}
                    className="px-6 py-2 text-sm font-semibold rounded-lg transition border"
                    style={{
                      borderColor: "var(--brand-lavender-soft)",
                      color: "var(--brand-dark)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
