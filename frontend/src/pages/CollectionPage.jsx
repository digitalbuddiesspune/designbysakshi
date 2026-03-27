import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const getGuestId = () => {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("guestId");
  if (!id) {
    id = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem("guestId", id);
  }
  return id;
};

const CollectionPage = ({ heroImage, subcategoryName, title }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inCartIds, setInCartIds] = useState(new Set());
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const guestId = useMemo(() => getGuestId(), []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        const normalizeText = (value) =>
          String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ");

        const slugify = (value) =>
          String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const categorySlug = "latest-collection";
        const categoryName = "latest collection";
        const targetName = normalizeText(subcategoryName);
        const targetSlug = slugify(subcategoryName);

        const filtered = (Array.isArray(data) ? data : []).filter((product) => {
          const productCategoryName = normalizeText(product?.category);
          const productCategorySlug = slugify(product?.category);
          const isLatestCollectionCategory =
            productCategorySlug === categorySlug || productCategoryName === categoryName;
          if (!isLatestCollectionCategory) return false;

          const productSubName = normalizeText(product?.subcategory);
          const productSubSlug = slugify(product?.subcategory);
          return productSubName === targetName || productSubSlug === targetSlug;
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching collection products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subcategoryName]);

  const loadCartWishlistState = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch(`${API_URL}/cart?guestId=${encodeURIComponent(guestId)}`),
        fetch(`${API_URL}/wishlist?guestId=${encodeURIComponent(guestId)}`),
      ]);

      const cartData = cartRes.ok ? await cartRes.json() : { items: [] };
      const wishlistData = wishlistRes.ok ? await wishlistRes.json() : { products: [] };

      const cartIds = new Set(
        (cartData?.items || [])
          .map((it) => it?.product?._id || it?.product)
          .filter(Boolean)
          .map(String),
      );
      const wishlistIds = new Set(
        (wishlistData?.products || [])
          .map((p) => p?._id || p)
          .filter(Boolean)
          .map(String),
      );

      setInCartIds(cartIds);
      setWishlistedIds(wishlistIds);
    } catch (err) {
      console.error("Error loading cart/wishlist state:", err);
    }
  };

  useEffect(() => {
    loadCartWishlistState();
    const onCartUpdated = () => loadCartWishlistState();
    const onWishlistUpdated = () => loadCartWishlistState();
    window.addEventListener("cart-updated", onCartUpdated);
    window.addEventListener("wishlist-updated", onWishlistUpdated);
    return () => {
      window.removeEventListener("cart-updated", onCartUpdated);
      window.removeEventListener("wishlist-updated", onWishlistUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestId]);

  const handleAddToCart = async (productId) => {
    if (inCartIds.has(String(productId))) return;
    try {
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      setInCartIds((prev) => new Set([...prev, String(productId)]));
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (wishlistedIds.has(String(productId))) return;
    try {
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      if (res.ok) {
        setWishlistedIds((prev) => new Set([...prev, String(productId)]));
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="flex justify-center">
        <img src={heroImage} alt={title} className="block h-auto" />
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      

        {loading ? (
          <p className="text-gray-500 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-lg text-center">
            <div className="mb-4 text-5xl">🛍️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-500 text-sm mb-6">Check back soon for new arrivals!</p>
            <Link to="/" className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition no-underline">
              Go to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  onClick={() => handleAddToWishlist(product._id)}
                  disabled={wishlistedIds.has(String(product._id))}
                  className="absolute right-2 top-2 z-10 rounded-full border bg-white p-1.5 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ borderColor: "var(--brand-lavender-soft)" }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill={wishlistedIds.has(String(product._id)) ? "#3D294D" : "none"}
                    stroke="#3D294D"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.716-4.35-9.193-7.047C.914 11.886 1.01 8.6 3.1 6.73c2.11-1.89 5.42-1.52 7.2.82l1.7 2.24 1.7-2.24c1.78-2.34 5.09-2.71 7.2-.82 2.09 1.87 2.186 5.156.293 7.223C18.716 16.65 12 21 12 21z" />
                  </svg>
                </button>
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 rounded-full border px-3 py-1.5 text-xs font-medium text-center no-underline transition hover:bg-gray-100"
                      style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product._id)}
                      disabled={inCartIds.has(String(product._id))}
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ background: "#3D294D" }}
                    >
                      {inCartIds.has(String(product._id)) ? "Added" : "Add to Cart"}
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

export default CollectionPage;
