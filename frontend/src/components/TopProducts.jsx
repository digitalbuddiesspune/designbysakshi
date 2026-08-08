import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeProductCard from "./HomeProductCard.jsx";
import { useCartQuantities } from "../hooks/useCartQuantities.js";
import { getGuestId } from "../utils/guestId.js";

const API_URL = import.meta.env.VITE_API_URL;
const HOMEPAGE_NEW_ARRIVAL_LIMIT = 10;

const FALLBACK_DESKTOP =
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773742412/3_xx5pf1.png";
const FALLBACK_MOBILE =
  "https://res.cloudinary.com/dbfooaz44/image/upload/v1773769835/3_lvbj7z.png";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState({
    imageDesktop: FALLBACK_DESKTOP,
    imageMobile: FALLBACK_MOBILE,
    link: "/new-arrival",
    active: true,
  });
  const { cartQuantities, cartBusyId, addToCart, setCartQuantity } = useCartQuantities();

  useEffect(() => {
    fetchNewArrivals();
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await fetch(`${API_URL}/homepage-sections/banners/new-arrival`);
      const data = await res.json();
      if (!res.ok) return;
      setBanner({
        imageDesktop: data.imageDesktop || FALLBACK_DESKTOP,
        imageMobile: data.imageMobile || FALLBACK_MOBILE,
        link: data.link || "/new-arrival",
        active: data.active !== false,
      });
    } catch (error) {
      console.error("Error fetching new arrival banner:", error);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch(`${API_URL}/products?category=new-arrival`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data.slice(0, HOMEPAGE_NEW_ARRIVAL_LIMIT) : []);
    } catch (error) {
      console.error("Error fetching new arrival products:", error);
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

  const bannerLink = banner.link || "/new-arrival";
  const showBanner = banner.active !== false && (banner.imageDesktop || banner.imageMobile);

  return (
    <section className="pb-6 sm:pb-8">
      {showBanner ? (
        <section className="bg-white">
          <Link to={bannerLink} className="block w-full">
            {banner.imageDesktop ? (
              <img
                src={banner.imageDesktop}
                alt="DesignBySakshi new arrival banner"
                className="hidden sm:block w-full h-auto object-cover"
              />
            ) : null}
            {banner.imageMobile || banner.imageDesktop ? (
              <img
                src={banner.imageMobile || banner.imageDesktop}
                alt="DesignBySakshi new arrival banner"
                className="block sm:hidden w-full h-auto object-cover"
              />
            ) : null}
          </Link>
        </section>
      ) : null}

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-2 sm:px-8 sm:pt-4 lg:px-10 lg:pt-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {products.map((product, index) => (
            <HomeProductCard
              key={product._id || index}
              product={product}
              index={index}
              badgeLabel="New Arrival"
              badgeStyle={{ background: "#116766" }}
              onAddToCart={addToCart}
              onSetCartQuantity={setCartQuantity}
              cartQuantity={cartQuantities[String(product._id)] || 0}
              cartBusy={cartBusyId === product._id}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-center sm:mt-8">
          <Link
            to="/new-arrival"
            className="inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition hover:bg-[#3D294D] hover:text-white"
            style={{ borderColor: "#3D294D", color: "#3D294D" }}
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
