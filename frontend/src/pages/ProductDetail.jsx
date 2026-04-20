import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartBusy, setCartBusy] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedWishlistedIds, setRelatedWishlistedIds] = useState(new Set());

  const guestId = useMemo(() => getGuestId(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);
        setActiveImageIndex(0);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadState = async () => {
      if (!product?._id) return;
      try {
        const wishlistRes = await fetch(`${API_URL}/wishlist?guestId=${encodeURIComponent(guestId)}`);
        const wishlistData = wishlistRes.ok ? await wishlistRes.json() : { products: [] };

        const wishlistIds = new Set(
          (wishlistData?.products || [])
            .map((p) => p?._id || p)
            .filter(Boolean)
            .map(String),
        );

        setInWishlist(wishlistIds.has(String(product._id)));
      } catch (e) {
        console.error("Load product state failed:", e);
      }
    };

    loadState();
  }, [product?._id, guestId]);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product?._id || !product?.category) {
        setRelatedProducts([]);
        return;
      }
      try {
        setRelatedLoading(true);
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const sameCategory = list
          .filter(
            (p) =>
              p?._id &&
              String(p._id) !== String(product._id) &&
              String(p.category || "").toLowerCase().trim() === String(product.category || "").toLowerCase().trim(),
          )
          .slice(0, 4);
        setRelatedProducts(sameCategory);
      } catch (e) {
        console.error("Load related products failed:", e);
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    loadRelatedProducts();
  }, [product?._id, product?.category]);

  useEffect(() => {
    const loadRelatedWishlistState = async () => {
      if (!relatedProducts.length) {
        setRelatedWishlistedIds(new Set());
        return;
      }
      try {
        const wishlistRes = await fetch(`${API_URL}/wishlist?guestId=${encodeURIComponent(guestId)}`);
        const wishlistData = wishlistRes.ok ? await wishlistRes.json() : { products: [] };

        const wishlistIds = new Set(
          (wishlistData?.products || [])
            .map((p) => p?._id || p)
            .filter(Boolean)
            .map(String),
        );

        setRelatedWishlistedIds(wishlistIds);
      } catch (e) {
        console.error("Load related product state failed:", e);
      }
    };

    loadRelatedWishlistState();
  }, [relatedProducts, guestId]);

  const handleAddToCart = async () => {
    try {
      setCartBusy(true);
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("Add to cart failed:", e);
    } finally {
      setCartBusy(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (inWishlist) return;
    try {
      setWishlistBusy(true);
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, guestId }),
      });
      if (res.ok) {
        setInWishlist(true);
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (e) {
      console.error("Add to wishlist failed:", e);
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleBuyNow = async () => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          product: { _id: product._id, name: product.name, image: product.image },
          quantity,
          priceAtAddTime: product.price,
        },
      },
    });
  };

  const handleAddRelatedToCart = async (productId) => {
    if (!productId) return;
    try {
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("Add related product to cart failed:", e);
    }
  };

  const handleAddRelatedToWishlist = async (productId) => {
    if (!productId || relatedWishlistedIds.has(String(productId))) return;
    try {
      const res = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, guestId }),
      });
      if (res.ok) {
        setRelatedWishlistedIds((prev) => new Set([...prev, String(productId)]));
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (e) {
      console.error("Add related product to wishlist failed:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--brand-dark)" }}>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--brand-dark)" }}>{error || "Product not found"}</p>
      </div>
    );
  }

  const hasDescription = !!product.description?.trim();
  const remainingStock = typeof product.stock === "number" ? product.stock : 0;
  const inStock = product.inStock && remainingStock > 0;
  const galleryImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0] || product.image;

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 items-start">

          {/* ── Left: Image ── */}
          <div className="flex items-start justify-center gap-4 w-full">
            {/* Thumbnails (left) */}
            {galleryImages.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-20 flex-shrink-0">
                {galleryImages.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border transition ${
                      idx === activeImageIndex
                        ? "border-[#3D294D] hover:border-[#3D294D]"
                        : "border-[#3D294D]/30 hover:border-[#3D294D]"
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                    style={{ background: "white" }}
                  >
                    <img src={src} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative w-full max-w-xl h-[390px] sm:h-[460px] overflow-hidden  shadow-md">
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={wishlistBusy || inWishlist}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)] disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={inWishlist ? "Wishlist added" : "Add to wishlist"}
              >
                <svg
                  className="h-5 w-5"
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: inWishlist ? "var(--brand-purple)" : "#4b5563" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Mobile thumbnails row */}
          {galleryImages.length > 1 && (
            <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-2 px-1">
              {galleryImages.map((src, idx) => (
                <button
                  key={`${src}-${idx}-mobile`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border transition flex-shrink-0 ${
                    idx === activeImageIndex
                      ? "border-[#3D294D] hover:border-[#3D294D]"
                      : "border-[#3D294D]/30 hover:border-[#3D294D]"
                  }`}
                  aria-label={`Select image ${idx + 1}`}
                  style={{ background: "white" }}
                >
                  <img src={src} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-6 justify-start pt-2">
            {/* Name */}
            <h1
              className="text-2xl sm:text-3xl font-semibold text-gray-900"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>

            {/* Stock */}
            {remainingStock <= 0 ? (
              <p className="text-sm font-medium text-red-500">Out of stock</p>
            ) : remainingStock <= 3 ? (
              <p className="text-sm font-medium text-green-600">Only {remainingStock} left</p>
            ) : null}

            {/* Description — only if present */}
            {hasDescription && (
              <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
            )}

            {/* ── Quantity selector ── */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-semibold text-gray-700">Qty:</span>
              <div className="flex items-center overflow-hidden rounded-lg bg-[#3D294D]/10">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-10 text-base font-bold text-white bg-[#3D294D] hover:bg-[#3D294D] transition disabled:opacity-40"
                  disabled={quantity <= 1 || !inStock}
                >
                  −
                </button>
                <div className="h-9 w-10 text-center text-sm font-semibold leading-9 text-gray-900">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="h-9 w-10 text-base font-bold text-white bg-[#3D294D] hover:bg-[#3D294D] transition disabled:opacity-40"
                  disabled={quantity >= product.stock || !inStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartBusy || !inStock}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#3D294D",
                }}
              >
                {cartBusy ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={cartBusy || !inStock}
                className="flex-1 rounded-full border px-4 py-2.5 text-sm font-semibold text-center transition hover:bg-[#3D294D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: "#3D294D",
                  background: "#3D294D",
                  color: "white",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>

        </div>

        {/* You May Also Like */}
        <div className="mt-10">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-center mb-6"
            style={{ color: "var(--brand-dark)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            You May Also Like
          </h2>
          {relatedLoading ? (
            <div className="text-center py-8 text-sm text-gray-600">Loading similar products...</div>
          ) : relatedProducts.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-600">No similar products found.</div>
          ) : (
            <>
              {/* Phone: horizontal scroll only when more than 2 items */}
              {relatedProducts.length > 2 ? (
                <div className="md:hidden flex gap-4 overflow-x-auto pb-2">
                  {relatedProducts.map((item) => (
                    <div
                      key={item._id}
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg min-w-[48%] max-w-[48%]"
                    >
                      <div className="relative aspect-[6/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={() => handleAddRelatedToWishlist(item._id)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={relatedWishlistedIds.has(String(item._id)) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: relatedWishlistedIds.has(String(item._id)) ? "var(--brand-purple)" : "#4b5563" }}
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
                      <div className="p-3">
                        <h3 className="mb-1 text-xs font-semibold text-gray-900 line-clamp-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="mt-2">
                          <button
                            type="button"
                            className="w-full rounded-full px-2 py-1 text-[10px] font-semibold text-white transition hover:opacity-95"
                            style={{ background: "#3D294D" }}
                            onClick={() => handleAddRelatedToCart(item._id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="md:hidden grid grid-cols-2 gap-4">
                  {relatedProducts.map((item) => (
                    <div
                      key={item._id}
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={() => handleAddRelatedToWishlist(item._id)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={relatedWishlistedIds.has(String(item._id)) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: relatedWishlistedIds.has(String(item._id)) ? "var(--brand-purple)" : "#4b5563" }}
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
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="w-full rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                            style={{ background: "#3D294D" }}
                            onClick={() => handleAddRelatedToCart(item._id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop: horizontal scroll only when more than 4 items */}
              {relatedProducts.length > 4 ? (
                <div className="hidden md:flex gap-6 overflow-x-auto pb-2">
                  {relatedProducts.map((item) => (
                    <div
                      key={`${item._id}-desktop-scroll`}
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg min-w-[23%]"
                    >
                      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={() => handleAddRelatedToWishlist(item._id)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={relatedWishlistedIds.has(String(item._id)) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: relatedWishlistedIds.has(String(item._id)) ? "var(--brand-purple)" : "#4b5563" }}
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
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="w-full rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                            style={{ background: "#3D294D" }}
                            onClick={() => handleAddRelatedToCart(item._id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((item) => (
                    <div
                      key={`${item._id}-desktop-grid`}
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={() => handleAddRelatedToWishlist(item._id)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={relatedWishlistedIds.has(String(item._id)) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: relatedWishlistedIds.has(String(item._id)) ? "var(--brand-purple)" : "#4b5563" }}
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
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="w-full rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                            style={{ background: "#3D294D" }}
                            onClick={() => handleAddRelatedToCart(item._id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;