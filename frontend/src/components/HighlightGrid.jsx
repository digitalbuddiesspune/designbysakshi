import React, { useState, useEffect } from "react";
import HomeProductCard from "./HomeProductCard.jsx";
import { useCartQuantities } from "../hooks/useCartQuantities.js";
import { getGuestId } from "../utils/guestId.js";

const API_URL = import.meta.env.VITE_API_URL;
const HOMEPAGE_BESTSELLER_LIMIT = 10;

const HighlightGrid = () => {
  const [products, setProducts] = useState([]);
  const { cartQuantities, cartBusyId, addToCart, setCartQuantity } = useCartQuantities();

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      const response = await fetch(`${API_URL}/products?category=bestseller`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.slice(0, HOMEPAGE_BESTSELLER_LIMIT) : []);
    } catch (error) {
      console.error("Error fetching bestseller products:", error);
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
    <section className="pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-8">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {products.map((product, index) => (
            <HomeProductCard
              key={product._id || index}
              product={product}
              index={index}
              badgeLabel="Bestseller"
              badgeStyle={{
                background: "linear-gradient(135deg, #d4a574 0%, #b8860b 100%)",
              }}
              onAddToCart={addToCart}
              onSetCartQuantity={setCartQuantity}
              cartQuantity={cartQuantities[String(product._id)] || 0}
              cartBusy={cartBusyId === product._id}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightGrid;
