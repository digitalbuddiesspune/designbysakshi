import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StarRatingPicker from "../components/StarRatingPicker";
import ProductCartAction from "../components/ProductCartAction.jsx";
import ProductPrice from "../components/ProductPrice.jsx";
import { flyToCart, getVisibleProductImage } from "../utils/flyToCart.js";
import { useCartQuantities } from "../hooks/useCartQuantities.js";
import { getGuestId } from "../utils/guestId.js";
import { getDiscountedPrice } from "../utils/pricing.js";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [canReview, setCanReview] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ stars: 5, review: "", image: "" });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [routeReviewOpen, setRouteReviewOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [careOpen, setCareOpen] = useState(true);

  const guestId = useMemo(() => getGuestId(), []);
  const { cartQuantities, cartBusyId, addToCart, setCartQuantity } = useCartQuantities();
  const navigate = useNavigate();
  const location = useLocation();

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
        // Keep main product selected by default; user picks a variant when needed
        setSelectedVariantId("");
        setCareOpen(true);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    setShowMoreDetails(true);
    setQuantity(1);
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
    const checkReviewEligibility = async () => {
      if (!product?._id) return;
      const token = localStorage.getItem("token");
      if (!token) {
        setCanReview(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/products/${product._id}/can-review`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.ok ? await res.json() : {};
        setCanReview(Boolean(data?.canReview));
      } catch (_e) {
        setCanReview(false);
      }
    };

    checkReviewEligibility();
  }, [product?._id]);

  useEffect(() => {
    if (!location.state?.openReviewModal) return;
    if (!product?._id) return;
    const alreadyReviewed = (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        const currentUserId = String(parsed?._id || parsed?.id || "");
        if (!currentUserId) return false;
        const reviews = Array.isArray(product?.userReviews) ? product.userReviews : [];
        return reviews.some((r) => {
          const reviewUserId = String(r?.user?._id || r?.user?.id || r?.userId || "");
          return reviewUserId && reviewUserId === currentUserId;
        });
      } catch (_e) {
        return false;
      }
    })();
    if (alreadyReviewed) return;
    setRouteReviewOpen(true);
    setShowReviewModal(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate, product?._id, product?.userReviews]);

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
          .slice(0, 5);
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
    const cartKey = selectedVariantId ? `${product._id}:${selectedVariantId}` : String(product._id);
    if ((cartQuantities[cartKey] || 0) > 0) return;
    try {
      setCartBusy(true);
      const mainImg = document.getElementById("product-main-image");
      if (mainImg) flyToCart(mainImg);
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          guestId,
          variantId: selectedVariantId || "",
        }),
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
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const selectedVariant = variants.find((v) => String(v._id) === String(selectedVariantId));
    const cartKey = selectedVariantId ? `${product._id}:${selectedVariantId}` : String(product._id);
    const inCart = cartQuantities[cartKey] || 0;
    const buyQty = inCart > 0 ? inCart : quantity;
    const displayImage =
      (Array.isArray(selectedVariant?.images) && selectedVariant.images[0]) || product.image;
    const basePrice = selectedVariant ? Number(selectedVariant.price) : product.price;
    navigate("/checkout", {
      state: {
        buyNowItem: {
          product: { _id: product._id, name: product.name, image: displayImage },
          quantity: buyQty,
          priceAtAddTime: getDiscountedPrice(basePrice, product.discountType),
          variantId: selectedVariantId || "",
          variantColor: selectedVariant?.color || "",
          variantSize: selectedVariant?.size || "",
          variantImage: displayImage || "",
        },
      },
    });
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

  const handleRelatedProductClick = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!canReview && !routeReviewOpen) {
      alert("You can review only after purchasing this product.");
      return;
    }
    const reviewText = String(reviewForm.review || "").trim();
    if (!reviewText) {
      alert("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch(`${API_URL}/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stars: Number(reviewForm.stars),
          review: reviewText,
          image: reviewForm.image,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Failed to submit review");
        return;
      }
      setProduct((prev) =>
        prev ? { ...prev, userReviews: Array.isArray(data.userReviews) ? data.userReviews : prev.userReviews } : prev,
      );
      setReviewForm({ stars: 5, review: "", image: "" });
      setShowReviewModal(false);
      setRouteReviewOpen(false);
      alert("Review submitted successfully.");
    } catch (_e) {
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
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
  const productVariants = Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = productVariants.length > 0;
  const selectedVariant =
    productVariants.find((v) => String(v._id) === String(selectedVariantId)) || null;
  const mainStock = typeof product.stock === "number" ? product.stock : 0;
  const variantStockTotal = productVariants.reduce(
    (sum, v) => sum + Number(v.stock || 0),
    0,
  );
  const totalStock = mainStock + variantStockTotal;
  const remainingStock = selectedVariant
    ? Number(selectedVariant.stock || 0)
    : mainStock;
  const inStock = product.inStock && remainingStock > 0;
  const cartKey = selectedVariantId ? `${product._id}:${selectedVariantId}` : String(product._id);
  const inCartQty = cartQuantities[cartKey] || 0;
  const displayQty = inCartQty > 0 ? inCartQty : quantity;
  const isMainCartBusy = cartBusyId === product._id || cartBusyId === cartKey;
  const displayPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);

  const handleDecreaseQty = () => {
    if (!inStock) return;
    if (inCartQty > 0) {
      setCartQuantity(product._id, inCartQty - 1, selectedVariantId || "");
      return;
    }
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQty = () => {
    if (!inStock) return;
    if (inCartQty > 0) {
      setCartQuantity(product._id, Math.min(remainingStock, inCartQty + 1), selectedVariantId || "");
      return;
    }
    setQuantity((q) => Math.min(remainingStock, q + 1));
  };
  const baseGallery =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image].filter(Boolean);
  const variantGallery =
    selectedVariant && Array.isArray(selectedVariant.images)
      ? selectedVariant.images.filter(Boolean)
      : [];
  // Always keep main product images; append selected variant images (deduped)
  const galleryImages = (() => {
    const seen = new Set();
    const merged = [];
    [...baseGallery, ...variantGallery].forEach((src) => {
      const key = String(src || "").trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      merged.push(key);
    });
    return merged.length ? merged : [product.image].filter(Boolean);
  })();
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0] || product.image;
  const features = Array.isArray(product.features) ? product.features : [];
  const stylingTips = Array.isArray(product.stylingTips) ? product.stylingTips : [];
  const careInstructions = Array.isArray(product.careInstructions) ? product.careInstructions : [];
  const userReviews = Array.isArray(product.userReviews) ? product.userReviews : [];
  const currentUserId = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return String(parsed?._id || parsed?.id || "");
    } catch (_e) {
      return "";
    }
  })();
  const hasUserReviewed = Boolean(
    currentUserId &&
      userReviews.some((r) => {
        const reviewUserId = String(r?.user?._id || r?.user?.id || r?.userId || "");
        return reviewUserId && reviewUserId === currentUserId;
      }),
  );
  const canOpenReview = (canReview || routeReviewOpen) && !hasUserReviewed;
  const showReviewsSection = canOpenReview || userReviews.length > 0;
  const previewFeatures = features.slice(0, 3);
  const hasMoreFeatures = features.length > 3;
  const hasHiddenDetails =
    hasMoreFeatures ||
    stylingTips.length > 0 ||
    Boolean(product.color) ||
    Boolean(product.hsnCode) ||
    careInstructions.length > 0 ||
    showReviewsSection;

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">

          {/* ── Left: Image & Trust Badges (sticky gallery on desktop) ── */}
          <div className="flex flex-col items-center w-full md:sticky md:top-4 md:self-start lg:top-6">
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
              <div className="w-full max-w-xl aspect-square overflow-hidden shadow-md">
                <img
                  id="product-main-image"
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>

            {/* Desktop Trust Badges (below image) */}
            <div className="hidden md:block w-full mt-3">
              <div className="rounded-xl border border-[#3D294D]/15 bg-[#FBF8FC] px-2 py-2.5 shadow-sm w-full">
                <div className="grid grid-cols-3 divide-x divide-[#3D294D]/15">
                  {/* Store Pickup */}
                  <div className="flex flex-col items-center justify-center px-1 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                      </svg>
                    </div>
                    <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                      Store Pickup
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                      Available
                    </span>
                  </div>

                  {/* Priority Shipping */}
                  <div className="flex flex-col items-center justify-center px-1 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                      Priority Shipping
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                      Available
                    </span>
                  </div>

                  {/* 24 Hours Easy Return */}
                  <div className="flex flex-col items-center justify-center px-1 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                    <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                      24 Hours
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                      Easy Return
                    </span>
                  </div>
                </div>
              </div>
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

          {/* ── Right: Details (scrollable on desktop; image stays sticky) ── */}
          <div className="scrollbar-hide flex min-h-0 flex-col gap-6 justify-start pt-2 md:max-h-[calc(100dvh-8.5rem)] md:overflow-y-auto md:overscroll-y-auto md:pr-1 md:pb-2 lg:max-h-[calc(100dvh-10.5rem)]">
            {/* Name */}
            <h1
              className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 -mt-3">
              <div className="flex items-center gap-0.5 text-amber-500 text-sm">
                {"★".repeat(Math.round(product.rating || (userReviews.length ? userReviews.reduce((a, b) => a + Number(b.stars || 0), 0) / userReviews.length : 5)))}
                {"☆".repeat(5 - Math.round(product.rating || (userReviews.length ? userReviews.reduce((a, b) => a + Number(b.stars || 0), 0) / userReviews.length : 5)))}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {product.rating || (userReviews.length ? (userReviews.reduce((a, b) => a + Number(b.stars || 0), 0) / userReviews.length).toFixed(1) : "5.0")}
              </span>
              <span className="text-xs text-gray-500">
                ({userReviews.length} {userReviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <ProductPrice
              price={displayPrice}
              discountType={product.discountType}
              size="lg"
            />

            {product.hsnCode ? (
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">HSN:</span> {product.hsnCode}
              </p>
            ) : null}

            {hasVariants && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Choose Variant</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVariantId("");
                      setActiveImageIndex(0);
                    }}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      !selectedVariantId
                        ? "border-[#3D294D] bg-[#3D294D]/10"
                        : "border-gray-200 hover:border-[#3D294D]/40"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {product.color?.trim() || "Default"}
                    </div>
                    <div className="text-xs text-gray-600">
                      <ProductPrice
                        price={product.price}
                        discountType={product.discountType}
                        size="sm"
                        showBadge={false}
                      />
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Qty: {mainStock}
                    </div>
                  </button>
                  {productVariants.map((variant) => {
                    const isActive = String(variant._id) === String(selectedVariantId);
                    const label = [variant.color, variant.size].filter(Boolean).join(" / ") || "Variant";
                    return (
                      <button
                        key={variant._id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(String(variant._id));
                          const variantImgs = (variant.images || []).filter(Boolean);
                          const firstExtra = variantImgs.find((src) => !baseGallery.includes(src));
                          if (!firstExtra) {
                            setActiveImageIndex(0);
                            return;
                          }
                          const merged = [];
                          const seen = new Set();
                          [...baseGallery, ...variantImgs].forEach((src) => {
                            if (!src || seen.has(src)) return;
                            seen.add(src);
                            merged.push(src);
                          });
                          setActiveImageIndex(Math.max(0, merged.indexOf(firstExtra)));
                        }}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                          isActive ? "border-[#3D294D] bg-[#3D294D]/10" : "border-gray-200 hover:border-[#3D294D]/40"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{label}</div>
                        <div className="text-xs text-gray-600">
                          <ProductPrice
                            price={variant.price}
                            discountType={product.discountType}
                            size="sm"
                            showBadge={false}
                          />
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Qty: {Number(variant.stock || 0)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            {remainingStock <= 0 ? (
              <p className="text-sm font-medium text-red-500">Out of stock</p>
            ) : remainingStock <= 3 ? (
              <p className="text-sm font-medium text-green-600">Only {remainingStock} left</p>
            ) : hasVariants ? (
              <p className="text-sm font-medium text-gray-600">
                {remainingStock} in stock
                {!selectedVariantId ? ` · ${totalStock} total` : ""}
              </p>
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
                  onClick={handleDecreaseQty}
                  className="h-9 w-10 text-base font-bold text-white bg-[#3D294D] hover:bg-[#3D294D] transition disabled:opacity-40"
                  disabled={(inCartQty === 0 && quantity <= 1) || !inStock || isMainCartBusy}
                >
                  −
                </button>
                <div className="h-9 w-10 text-center text-sm font-semibold leading-9 text-gray-900">
                  {displayQty}
                </div>
                <button
                  type="button"
                  onClick={handleIncreaseQty}
                  className="h-9 w-10 text-base font-bold text-white bg-[#3D294D] hover:bg-[#3D294D] transition disabled:opacity-40"
                  disabled={displayQty >= remainingStock || !inStock || isMainCartBusy}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartBusy || !inStock || inCartQty > 0 || isMainCartBusy}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#3D294D",
                }}
              >
                {inCartQty > 0 ? "In Cart" : cartBusy ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={cartBusy || !inStock || isMainCartBusy}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold text-center transition hover:bg-[#3D294D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: "#3D294D",
                  background: "#3D294D",
                  color: "white",
                }}
              >
                Buy Now
              </button>
            </div>

            {/* ── Mobile Trust Badges (Store Pickup, Priority Shipping, 24 Hours Return) ── */}
            <div className="md:hidden block my-2 rounded-xl border border-[#3D294D]/15 bg-[#FBF8FC] px-2 py-2.5 shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-[#3D294D]/15">
                {/* Store Pickup */}
                <div className="flex flex-col items-center justify-center px-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                  </div>
                  <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                    Store Pickup
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                    Available
                  </span>
                </div>

                {/* Priority Shipping */}
                <div className="flex flex-col items-center justify-center px-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                    Priority Shipping
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                    Available
                  </span>
                </div>

                {/* 24 Hours Easy Return */}
                <div className="flex flex-col items-center justify-center px-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF7] text-[#3D294D] sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-[#3D294D] sm:h-5 sm:w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <span className="mt-1.5 text-[11px] font-bold text-[#3D294D] sm:text-xs leading-tight">
                    24 Hours
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-[#6A527A]">
                    Easy Return
                  </span>
                </div>
              </div>
            </div>

            {features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Features</h3>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {features.map((item, idx) => (
                    <li key={`feature-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {stylingTips.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Styling Tips</h3>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {stylingTips.map((item, idx) => (
                    <li key={`tip-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.color && !hasVariants && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Color:</span> {product.color}
              </p>
            )}

            {careInstructions.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setCareOpen((open) => !open)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    {product.careTitle || "Jewellery Care"}
                  </h3>
                  <span className="text-xs font-semibold text-green-600">
                    {careOpen ? "Hide" : "Show"}
                  </span>
                </button>
                {careOpen && (
                  <div className="mt-2 space-y-3">
                    {product.careDescription ? (
                      <p className="text-sm text-gray-600">{product.careDescription}</p>
                    ) : null}
                    <ul className="space-y-2">
                      {careInstructions.map((item) => (
                        <li key={item.id || item.title} className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">{item.title}: </span>
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ── Store Policies Section (Returns & RTO Policy) ── */}
            <div className="rounded-xl border border-[#3D294D]/15 bg-[#FAF7FC] p-4 text-xs sm:text-sm text-gray-700 space-y-4 shadow-sm">
              {/* 1. Returns & Refund Policy */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#3D294D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <h3 className="font-bold text-[#3D294D] text-sm sm:text-base">
                    Returns & Refund Policy
                  </h3>
                </div>

                <p className="font-semibold text-gray-900">
                  We offer Returns & Refunds only (No Exchanges).
                </p>

                <p className="text-gray-700">
                  Return requests must be raised <span className="font-bold text-[#3D294D]">within 24 hours of delivery.</span>
                </p>

                <ul className="space-y-1.5 pt-0.5 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>Product must be unused and in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>Refunds are processed after quality check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>₹99 return shipping fee applies for all orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>Refund will be credited to the original payment method</span>
                  </li>
                </ul>
              </div>

              {/* 2. RTO (Return to Origin) Policy */}
              <div className="border-t border-[#3D294D]/15 pt-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#3D294D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <h3 className="font-bold text-[#3D294D] text-sm sm:text-base">
                    RTO (Return to Origin) Policy
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  If an order is returned to us <span className="font-bold text-gray-900">(RTO)</span> for any reason, the amount will be issued as <span className="font-bold text-[#3D294D]">store credit</span> within <span className="font-bold text-gray-900">3–4 working days</span> after the parcel is received back. A flat <span className="font-bold text-[#3D294D]">₹99 RTO fee</span> will be deducted.
                </p>

                <p className="text-gray-700 leading-relaxed pt-1">
                  <span className="font-bold text-gray-900">Refunds to the original payment method are not applicable.</span> The returned parcel will not be re-shipped. If you wish to receive the same product again, you may place a <span className="font-semibold text-[#3D294D]">new order using the store credit.</span>
                </p>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-500 italic pt-2 border-t border-[#3D294D]/10">
                By placing an order, you agree to our return & RTO policies.
              </p>
            </div>

                {showReviewsSection && (
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className="text-lg font-semibold text-gray-900"
                        style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                      >
                        Reviews
                      </h2>
                      {canOpenReview && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="rounded-full bg-[#3D294D] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                        >
                          Add Review
                        </button>
                      )}
                    </div>

                    {userReviews.length > 0 && (
                      <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto pb-1">
                        {userReviews.map((r, idx) => {
                          const reviewerName = r?.user?.name || "User";
                          const reviewerInitial = reviewerName.charAt(0).toUpperCase();
                          return (
                            <button
                              key={`${r._id || idx}`}
                              type="button"
                              onClick={() => setSelectedReview(r)}
                              className="flex min-w-[220px] max-w-[300px] flex-shrink-0 cursor-pointer items-start gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-left transition hover:border-[#3D294D]/40 hover:bg-gray-100"
                            >
                              {r.image ? (
                                <img
                                  src={r.image}
                                  alt={`${reviewerName} review`}
                                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-1 ring-gray-200"
                                />
                              ) : (
                                <div
                                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                                  style={{ background: "#3D294D" }}
                                  aria-hidden
                                >
                                  {reviewerInitial}
                                </div>
                              )}
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <p className="text-sm font-semibold leading-tight text-gray-900">
                                  {reviewerName}
                                </p>
                                <p className="text-xs leading-none text-amber-600">
                                  {"★".repeat(Number(r.stars || 0))}
                                </p>
                                <p className="line-clamp-3 text-xs leading-relaxed text-gray-600">
                                  {r.review}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
          </div>

        </div>

        {selectedReview && (
          <div
            className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSelectedReview(null)}
            role="presentation"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-detail-title"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {selectedReview.image ? (
                    <img
                      src={selectedReview.image}
                      alt=""
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-gray-200"
                    />
                  ) : (
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
                      style={{ background: "#3D294D" }}
                    >
                      {(selectedReview?.user?.name || "User").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 id="review-detail-title" className="text-lg font-semibold text-gray-900">
                      {selectedReview?.user?.name || "User"}
                    </h3>
                    <p className="mt-1 text-sm text-amber-600">
                      {"★".repeat(Number(selectedReview.stars || 0))}
                      <span className="ml-1 text-gray-500">
                        ({selectedReview.stars || 0}/5)
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close review"
                >
                  ✕
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {selectedReview.review}
              </p>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Review</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setRouteReviewOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close review modal"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <StarRatingPicker
                  label="Your rating"
                  value={reviewForm.stars}
                  onChange={(stars) => setReviewForm((prev) => ({ ...prev, stars }))}
                />
                <textarea
                  rows={4}
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, review: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Write your review..."
                />
                <input
                  type="url"
                  value={reviewForm.image}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Optional image URL"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="rounded-full bg-[#3D294D] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* You May Also Like */}
        <div className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2">
          <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-10">
          <h2
            className="mb-4 text-xl font-semibold text-center sm:mb-5 sm:text-2xl"
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
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg min-w-[48%] max-w-[48%] cursor-pointer"
                      onClick={() => handleRelatedProductClick(item._id)}
                    >
                      <div className="relative aspect-[6/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          data-related-product-image={item._id}
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRelatedToWishlist(item._id);
                          }}
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
                        <h3 className="mb-1 text-xs font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <ProductPrice price={item.price} discountType={item.discountType} size="sm" />
                        </div>
                        <div className="mt-2">
                          <ProductCartAction
                            productId={item._id}
                            cartQuantity={cartQuantities[String(item._id)] || 0}
                            cartBusy={cartBusyId === item._id}
                            getImageEl={() => getVisibleProductImage(`[data-related-product-image="${item._id}"]`)}
                            onAdd={addToCart}
                            onSetQuantity={setCartQuantity}
                            buttonClassName="flex min-h-8 w-full items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 sm:min-h-9 sm:text-base"
                          />
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
                      className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
                      onClick={() => handleRelatedProductClick(item._id)}
                    >
                      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          data-related-product-image={item._id}
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                          aria-label="Add to wishlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRelatedToWishlist(item._id);
                          }}
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
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-1" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <ProductPrice price={item.price} discountType={item.discountType} size="lg" />
                        </div>
                        <div className="mt-3">
                          <ProductCartAction
                            productId={item._id}
                            cartQuantity={cartQuantities[String(item._id)] || 0}
                            cartBusy={cartBusyId === item._id}
                            getImageEl={() => getVisibleProductImage(`[data-related-product-image="${item._id}"]`)}
                            onAdd={addToCart}
                            onSetQuantity={setCartQuantity}
                            buttonClassName="flex min-h-8 w-full items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 sm:min-h-9 sm:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop: 5 products in one row */}
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedProducts.map((item) => (
                  <div
                    key={`${item._id}-desktop-grid`}
                    className="group relative bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
                    onClick={() => handleRelatedProductClick(item._id)}
                  >
                    <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        data-related-product-image={item._id}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-[var(--brand-lavender-soft)]"
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRelatedToWishlist(item._id);
                        }}
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
                    <div className="p-3 lg:p-2">
                      <h3
                        className="mb-1 line-clamp-1 text-xs font-semibold text-gray-900 sm:text-sm lg:text-xs"
                        style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 sm:text-base lg:text-sm">
                          <ProductPrice price={item.price} discountType={item.discountType} size="sm" />
                        </span>
                      </div>
                      <div className="mt-2 lg:mt-1.5">
                        <ProductCartAction
                          productId={item._id}
                          cartQuantity={cartQuantities[String(item._id)] || 0}
                          cartBusy={cartBusyId === item._id}
                          getImageEl={() => getVisibleProductImage(`[data-related-product-image="${item._id}"]`)}
                          onAdd={addToCart}
                          onSetQuantity={setCartQuantity}
                          buttonClassName="flex min-h-8 w-full items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 sm:min-h-9 sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;