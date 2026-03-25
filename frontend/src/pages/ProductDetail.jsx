import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const handleAddToCart = async () => {
    try {
      setCartBusy(true);
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error("Add to cart failed:", e);
    } finally {
      setCartBusy(false);
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
        <div className="grid gap-8 md:grid-cols-2 items-center">

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
            <div className="w-full max-w-md aspect-[10/9] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover"
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
          {/* If no description → center vertically; if description → start from top with padding */}
          <div
            className={`flex flex-col gap-4 ${
              hasDescription ? "justify-start pt-4" : "justify-center"
            }`}
          >
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
            <div className="flex items-center gap-3">
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
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartBusy || !inStock}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#3D294D",
                }}
              >
                {added ? "✓ Added!" : cartBusy ? "Adding..." : "Add to Cart"}
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
      </div>
    </div>
  );
};

export default ProductDetail;