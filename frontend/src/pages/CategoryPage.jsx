import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, selectedSubcategory]);

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
      let url = `${API_URL}/products?category=${categorySlug}`;
      if (selectedSubcategory) {
        url += `&subcategory=${selectedSubcategory}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
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

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Category Image + Subcategory Filter — same row */}
        {currentCategory && (
          <div className="flex items-center gap-3 mb-4 -mt-6">
            {categoryImages[categorySlug] && (
              <img
                src={categoryImages[categorySlug]}
                alt={currentCategory?.name || categorySlug}
                className="h-14 w-14 sm:h-24 sm:w-24 object-contain flex-shrink-0"
              />
            )}
            {currentCategory.subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-nowrap sm:flex-wrap">
                <button
                  onClick={() => handleSubcategoryChange("")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition flex-shrink-0 ${
                    selectedSubcategory === "" ? "text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={selectedSubcategory === "" ? { background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)" } : {}}
                >
                  All
                </button>
                {currentCategory.subcategories.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => handleSubcategoryChange(sub.slug)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition flex-shrink-0 ${
                      selectedSubcategory === sub.slug ? "text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={selectedSubcategory === sub.slug ? { background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)" } : {}}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: "var(--brand-dark)" }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "var(--brand-dark)" }}>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
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
                    onClick={() => handleAddToWishlist(product._id)}
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
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 rounded-full border px-3 py-1.5 text-xs font-medium text-center no-underline transition hover:bg-gray-100"
                      style={{
                        borderColor: "var(--brand-lavender-soft)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
                      }}
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
