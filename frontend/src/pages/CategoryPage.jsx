import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("subcategory");

  // derive slug from path, e.g. "/earrings" -> "earrings"
  const pathSlug = location.pathname.replace(/^\//, "");
  // Normalize slug variations (e.g., "ring" -> "rings")
  const slugMap = {
    "ring": "rings"
  };
  const categorySlug = slugMap[pathSlug] || pathSlug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam || "");
  const [categories, setCategories] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  // Price filter state (min/max derived from fetched products)
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [minMaxInitialized, setMinMaxInitialized] = useState(false);

  const normalizeSlug = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, selectedSubcategory]);

  // Keep selected subcategory in sync with URL when user navigates via navbar links.
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
        if (productCategorySlug !== normalizedCategorySlug) return false;

        if (!normalizedSelectedSub) return true;
        const productSubcategorySlug = normalizeSlug(product?.subcategory);
        if (productSubcategorySlug === normalizedSelectedSub) return true;

        // Fallback to text-normalized comparison for mixed slug/name formats.
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

  // Find category by matching slug (try both normalized and original)
  const currentCategory = categories.find(
    (cat) => cat.slug === categorySlug || cat.slug === pathSlug
  );
  const visibleSubcategories = currentCategory?.subcategories || [];

  // Do not auto-clear URL-selected subcategory.
  // Backend/category data can have slug variations; keep user's selected URL filter intact.

  // Debug: Log category info
  useEffect(() => {
    if (categories.length > 0) {
      console.log("All categories:", categories.map(c => ({ name: c.name, slug: c.slug, subCount: c.subcategories?.length || 0 })));
      console.log("Looking for category with slug:", categorySlug, "or", pathSlug);
      console.log("Found category:", currentCategory ? { name: currentCategory.name, slug: currentCategory.slug, subcategories: currentCategory.subcategories } : "NOT FOUND");
    }
  }, [categories, categorySlug, pathSlug, currentCategory]);

  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const computeMinMax = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return { min: 0, max: 0 };
    const prices = arr
      .map((p) => (typeof p.price === "number" ? p.price : Number(p.price)))
      .filter((n) => Number.isFinite(n));
    if (prices.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  // Initialize price range whenever products change (for current category/subcategory)
  useEffect(() => {
    if (!loading) {
      const { min, max } = computeMinMax(products);
      setPriceMin(min);
      setPriceMax(max);
      setMinMaxInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, loading]);

  const handleSubcategoryChange = (subSlug) => {
    const newSubcategory = subSlug === selectedSubcategory ? "" : subSlug;
    setSelectedSubcategory(newSubcategory);
    
    // Update URL with new subcategory
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSubcategory) {
      newSearchParams.set("subcategory", newSubcategory);
    } else {
      newSearchParams.delete("subcategory");
    }
    setSearchParams(newSearchParams);
  };

  const handleAddToCart = async (productId) => {
    try {
      const guestId = getGuestId();
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          guestId,
        }),
      });
     
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Could not add to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          guestId,
        }),
      });
      if (res.ok) {
        setWishlistedIds((prev) => new Set([...prev, productId]));
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Could not add to wishlist. Please try again.");
    }
  };

  const categoryImages = {
    "necklace-sets": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773733305/High-End_Bridal_Necklace_Set__Bridal_Jewelry__Wedding_Dress_Accessory__Light_Gold_Silver_Gold-Color-removebg-preview_n4px8z.png",
    "earrings": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773733200/High_jewelry_futuristic_earrings_made_of_silver__elements__lines__flower-removebg-preview_epryye.png",
    "rings": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773732024/41yKk1H7s2L-removebg-preview_pakeea.png",
    "bangles-bracelets": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773730539/bangals-removebg-preview_bv3mwx.png",
    "pendants": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773731748/download__14_-removebg-preview_m5de9b.png",
    "bridal-jewellery": "https://res.cloudinary.com/dbfooaz44/image/upload/v1773731628/download__15_-removebg-preview_2_spcetj.png",
    "anklets":"https://res.cloudinary.com/dbfooaz44/image/upload/v1773730347/If_you_prefer_silver_anklets__we_got_you____In_order_of_appearance__Bar_charm_anklet_Twist_anklet_Millipede_anklet_Chain_link_anklet_Flower_charm_anklet__Price__N1500-2000_All_non_tarnish____To_shop___iekjrt.png"
  };

  const filteredProducts = products.filter((p) => {
    const price = typeof p.price === "number" ? p.price : Number(p.price);
    if (!Number.isFinite(price)) return false;
    if (priceMin !== null && price < priceMin) return false;
    if (priceMax !== null && price > priceMax) return false;
    return true;
  });

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categorySlug === "latest-collection" && (
          <div className="mb-6">
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

        {/* Sticky subcategory + filter row under navbar */}
        {currentCategory && (
          <div
            className="sticky top-16 md:top-[112px] lg:top-[144px] z-30 border-b bg-white"
            style={{ borderColor: "rgba(91, 71, 109, 0.16)" }}
          >
            <div className="py-1 px-1 sm:px-2 space-y-2">
              {/* Row 1: Subcategories in one line */}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  {categoryImages[categorySlug] && (
                    <img
                      src={categoryImages[categorySlug]}
                      alt={currentCategory?.name || categorySlug}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
                    />
                  )}
                  {visibleSubcategories.length > 0 && (
                    <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap">
                      <button
                        onClick={() => handleSubcategoryChange("")}
                        className={`rounded-full px-3 py-2 text-xs font-medium transition flex-shrink-0 ${
                          selectedSubcategory === "" ? "text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{
                          background:
                            selectedSubcategory === ""
                              ? "#3D294D"
                              : undefined,
                        }}
                      >
                        All
                      </button>
                      {visibleSubcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategoryChange(sub.slug)}
                          className={`rounded-full px-3 py-2 text-xs font-medium transition flex-shrink-0 ${
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
                  )}
                </div>

              </div>

              {/* Row 2: Filter under "All" chips area */}
              <div className={`flex justify-start ${categoryImages[categorySlug] ? "ml-12 sm:ml-14" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--brand-dark)" }}>
                    filter
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]" style={{ color: "var(--brand-muted)" }}>
                        min
                      </span>
                      <input
                        type="number"
                        value={priceMin ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          setPriceMin(val);
                        }}
                        className="w-20 rounded-lg border px-2 py-2 text-[12px] focus:outline-none focus:ring-2"
                        style={{ borderColor: "var(--brand-lavender-soft)" }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]" style={{ color: "var(--brand-muted)" }}>
                        max
                      </span>
                      <input
                        type="number"
                        value={priceMax ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          setPriceMax(val);
                        }}
                        className="w-20 rounded-lg border px-2 py-2 text-[12px] focus:outline-none focus:ring-2"
                        style={{ borderColor: "var(--brand-lavender-soft)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>No products found in this category.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "var(--brand-dark)" }}>No products match your price range.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="group relative block bg-white shadow-sm transition-all duration-300 hover:shadow-lg no-underline"
                >
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Wishlist Icon */}
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
                <div className="p-4">
                  <h3
                    className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2"
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                    }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-1.5 sm:gap-2">
                    <span
                      className="flex min-h-8 flex-1 items-center justify-center rounded-full border px-1.5 py-1 text-[9px] font-medium text-center no-underline whitespace-nowrap transition text-[#3D294D] hover:bg-[#3D294D] hover:text-white sm:min-h-10 sm:px-3 sm:py-1.5 sm:text-xs"
                      style={{
                        borderColor: "#3D294D",
                      }}
                    >
                      View Details
                    </span>
                    <button
                      type="button"
                      className="flex min-h-8 flex-1 items-center justify-center rounded-full px-1.5 py-1 text-[9px] font-semibold text-white whitespace-nowrap transition hover:opacity-95 sm:min-h-10 sm:px-3 sm:py-1.5 sm:text-xs"
                      style={{
                        background: "#3D294D",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CategoryPage;
