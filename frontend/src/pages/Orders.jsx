import React from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

const Orders = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1
            className="text-3xl font-medium mb-8"
            style={{
              color: "var(--brand-dark)",
              fontFamily: "Cormorant Garamond, Georgia, serif",
            }}
          >
            My Orders
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">No orders yet. Start shopping to see your orders here!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
