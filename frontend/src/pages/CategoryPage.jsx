import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import CartQuantityControls from "../components/CartQuantityControls.jsx";
import ProductPrice from "../components/ProductPrice.jsx";
import { flyToCart, getVisibleProductImage } from "../utils/flyToCart.js";
import { useCartQuantities } from "../hooks/useCartQuantities.js";

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("subcategory");

  const pathSlug = location.pathname.replace(/^\//, "");
  const slugMap = { "ring": "rings" };
  const categorySlug = slugMap[pathSlug] || pathSlug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam || "");
  const [categories, setCategories] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const { cartQuantities, cartBusyId, addToCart, setCartQuantity } = useCartQuantities();

  const normalizeSlug = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (categorySlug) fetchProducts();
  }, [categorySlug, selectedSubcategory]);

  useEffect(() => {
    setSelectedSubcategory(subcategoryParam || "");
  }, [subcategoryParam]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      const normalizedCategorySlug = normalizeSlug(categorySlug);
      const normalizedSelectedSub = normalizeSlug(selectedSubcategory);

      const filtered = (Array.isArray(data) ? data : []).filter((product) => {
        const productCategorySlug = normalizeSlug(product?.category);
        const productSubcategorySlug = normalizeSlug(product?.subcategory);
        const productLatestSubSlug = normalizeSlug(product?.latestCollectionSubcategory);

        if (normalizedCategorySlug === "bestseller") {
          return product.isBestseller || productCategorySlug === "bestseller";
        }
        if (normalizedCategorySlug === "new-arrival") {
          return product.isNewArrival || productCategorySlug === "new-arrival";
        }
        if (normalizedCategorySlug === "latest-collection") {
          if (normalizedSelectedSub) {
            return (
              (productCategorySlug === "latest-collection" && productSubcategorySlug === normalizedSelectedSub) ||
              productLatestSubSlug === normalizedSelectedSub
            );
          }
          return productCategorySlug === "latest-collection" || Boolean(product.latestCollectionSubcategory);
        }

        if (productCategorySlug !== normalizedCategorySlug) return false;
        if (!normalizedSelectedSub) return true;
        if (productSubcategorySlug === normalizedSelectedSub) return true;
        const productSubText = String(product?.subcategory || "").toLowerCase().replace(/[_-]+/g, " ").trim();
        const selectedSubText = String(selectedSubcategory || "").toLowerCase().replace(/[_-]+/g, " ").trim();
        return productSubText === selectedSubText;
      });

      setProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(
    (cat) => cat.slug === categorySlug || cat.slug === pathSlug
  );
  const visibleSubcategories = currentCategory?.subcategories || [];

  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleSubcategoryChange = (subSlug) => {
    const newSubcategory = subSlug === selectedSubcategory ? "" : subSlug;
    setSelectedSubcategory(newSubcategory);
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSubcategory) {
      newSearchParams.set("subcategory", newSubcategory);
    } else {
      newSearchParams.delete("subcategory");
    }
    setSearchParams(newSearchParams);
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      if (res.ok) setWishlistedIds((prev) => new Set([...prev, productId]));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Could not add to wishlist. Please try again.");
    }
  };

  return (
    // ✅ No horizontal padding here — banner must go full width
    <div className="bg-white pb-8 sm:pb-10">

      {/* ─── FULL-BLEED BANNER (latest-collection) ─── */}
      {categorySlug === "latest-collection" && (
        <div className="w-full">
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774852455/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1080_x_400_px_1920_x_400_px_1080_x_700_px_1920_x_500_px_s5bd4k.png"
            alt="Latest Collection"
            className="hidden w-full h-auto object-cover md:block"
          />
          <img
            src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774852466/Untitled_1000_x_500_px_1920_x_550_px_1080_x_700_px_1080_x_400_px_1080_x_400_px_1920_x_400_px_1080_x_700_px_1_yq5w3h.png"
            alt="Latest Collection"
            className="block w-full h-auto object-cover md:hidden"
          />
        </div>
      )}

      {/* Full-width subcategory bar */}
      {currentCategory && visibleSubcategories.length > 0 && (
        <div
          className="sticky top-16 z-30 w-full border-b bg-white md:top-[112px] lg:top-[144px]"
          style={{ borderColor: "rgba(91, 71, 109, 0.16)" }}
        >
          <div className="flex w-full items-center gap-1.5 overflow-x-auto px-6 py-1 no-scrollbar sm:px-8 lg:px-10">
            <button
              onClick={() => handleSubcategoryChange("")}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition flex-shrink-0 sm:px-3 sm:text-xs ${
                selectedSubcategory === "" ? "text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ background: selectedSubcategory === "" ? "#3D294D" : undefined }}
            >
              All
            </button>
            {visibleSubcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryChange(sub.slug)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition flex-shrink-0 sm:px-3 sm:text-xs ${
                  normalizeSlug(selectedSubcategory) === normalizeSlug(sub.slug)
                    ? "text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{
                  background:
                    normalizeSlug(selectedSubcategory) === normalizeSlug(sub.slug)
                      ? "#3D294D"
                      : undefined,
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-10">
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {products.map((product) => {
                const productId = String(product._id);
                const inCartQty = cartQuantities[productId] || 0;
                const isBusy = String(cartBusyId) === productId;

                return (
                <div
                  key={product._id}
                  className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="block no-underline"
                  >
                  <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      data-product-image={productId}
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToWishlist(product._id);
                      }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill={wishlistedIds.has(product._id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: wishlistedIds.has(product._id) ? "var(--brand-purple)" : "#4b5563" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3 lg:p-2">
                    {(() => {
                      const reviews = Array.isArray(product?.userReviews) ? product.userReviews : [];
                      const realRating =
                        typeof product?.rating === "number" && product.rating > 0
                          ? product.rating.toFixed(1)
                          : reviews.length > 0
                            ? (reviews.reduce((acc, r) => acc + Number(r.stars || 0), 0) / reviews.length).toFixed(1)
                            : null;
                      return (
                        <div className="mb-0.5 flex items-center gap-1">
                          <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[11px] font-semibold text-gray-800">
                            {realRating || "No ratings"}
                          </span>
                        </div>
                      );
                    })()}
                    <h3
                      className="mb-1 line-clamp-1 text-xs font-semibold text-gray-900 sm:text-sm lg:text-xs"
                      style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <ProductPrice
                        price={product.price}
                        discountType={product.discountType}
                        size="sm"
                        priceClassName="font-bold text-gray-900 sm:text-base lg:text-sm"
                      />
                    </div>
                  </div>
                  </Link>
                    <div className="px-3 pb-3 lg:px-2 lg:pb-2">
                    {inCartQty > 0 ? (
                      <CartQuantityControls
                        quantity={inCartQty}
                        disabled={isBusy}
                        onDecrease={() => setCartQuantity(product._id, inCartQty - 1)}
                        onIncrease={() => setCartQuantity(product._id, inCartQty + 1)}
                      />
                    ) : (
                      <button
                        type="button"
                        className="flex min-h-8 w-full items-center justify-center rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 sm:min-h-9 sm:text-base"
                        style={{ background: "#3D294D" }}
                        disabled={isBusy}
                        onClick={() => {
                          const imageEl = getVisibleProductImage(`[data-product-image="${productId}"]`);
                          addToCart(product._id, imageEl);
                        }}
                      >
                        {isBusy ? "Adding..." : "Add to Cart"}
                      </button>
                    )}
                    </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;