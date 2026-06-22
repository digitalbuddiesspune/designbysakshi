import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeProductCard from "./HomeProductCard.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const HOMEPAGE_NEW_ARRIVAL_LIMIT = 8;

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch(`${API_URL}/products?category=new-arrival`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.slice(0, HOMEPAGE_NEW_ARRIVAL_LIMIT) : []);
    } catch (error) {
      console.error("Error fetching new arrival products:", error);
    }
  };

  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  const handleAddToCart = async (productId) => {
    try {
      const guestId = getGuestId();
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const guestId = getGuestId();
      await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  if (!products.length) return null;

  return (
    <section className="pb-6 sm:pb-8">
      <section className="bg-white">
        <Link to="/new-arrival" className="block w-full">
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773742412/3_xx5pf1.png"
            alt="DesignBySakshi new arrival banner"
            className="hidden sm:block w-full h-auto object-cover"
          />
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1773769835/3_lvbj7z.png"
            alt="DesignBySakshi new arrival banner"
            className="block sm:hidden w-full h-auto object-cover"
          />
        </Link>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-4 lg:px-8 lg:pt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <HomeProductCard
              key={product._id || index}
              product={product}
              index={index}
              badgeLabel="New Arrival"
              badgeStyle={{ background: "#116766" }}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
