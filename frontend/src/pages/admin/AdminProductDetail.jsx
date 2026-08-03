import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const DetailField = ({ label, children, className = "" }) => (
  <div className={className}>
    <p className="text-xs font-bold uppercase tracking-wider text-gray-900">{label}</p>
    <div className="mt-1 text-sm text-gray-600">{children}</div>
  </div>
);

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (!token) {
      alert("Admin token missing");
      return;
    }
    if (!window.confirm("Remove this review?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Failed to remove review");
        return;
      }
      if (data?.product) setProduct(data.product);
      else await fetchProduct();
    } catch (error) {
      console.error("Error removing review:", error);
      alert("Failed to remove review");
    }
  };

  const gallery =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-600">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-4 text-sm font-semibold"
          style={{ color: "#3D294D" }}
        >
          Back to My Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-5 shadow-sm sm:px-4 sm:py-6">
          {gallery.length > 0 && (
            <div className="mb-6 flex gap-3 overflow-x-auto">
              {gallery.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  className="h-32 w-32 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128";
                  }}
                />
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Name">
                <p className="text-lg font-semibold text-gray-900">{product.name}</p>
              </DetailField>
              <DetailField label="Color">{product.color || "-"}</DetailField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Price">
                <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
              </DetailField>
              <DetailField label="Discount">
                {product.discountType ? `${product.discountType}%` : "-"}
              </DetailField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="HSN Code">{product.hsnCode || "-"}</DetailField>
              <DetailField label="Main Category">{product.category || "-"}</DetailField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Subcategory">{product.subcategory || "-"}</DetailField>
              <DetailField label="Stock">{product.stock ?? 0}</DetailField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="In Stock">{product.inStock ? "Yes" : "No"}</DetailField>
              <DetailField label="Bestseller">{product.isBestseller ? "Yes" : "No"}</DetailField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="New Arrival">{product.isNewArrival ? "Yes" : "No"}</DetailField>
              {product.latestCollectionSubcategory ? (
                <DetailField label="Latest Collection Subcategory">
                  {product.latestCollectionSubcategory}
                </DetailField>
              ) : (
                <div />
              )}
            </div>

            {product.description && (
              <DetailField label="Description">
                <p className="leading-relaxed">{product.description}</p>
              </DetailField>
            )}

            {(Array.isArray(product.features) && product.features.length > 0) ||
            (Array.isArray(product.stylingTips) && product.stylingTips.length > 0) ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailField label="Features">
                  {Array.isArray(product.features) && product.features.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {product.features.map((item, idx) => (
                        <li key={`feature-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </DetailField>
                <DetailField label="Styling Tips">
                  {Array.isArray(product.stylingTips) && product.stylingTips.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {product.stylingTips.map((item, idx) => (
                        <li key={`tip-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </DetailField>
              </div>
            ) : null}

            <DetailField label="Variants">
              {Array.isArray(product.variants) && product.variants.length > 0 ? (
                <div className="space-y-3">
                  {product.variants.map((variant, idx) => {
                    const images = Array.isArray(variant.images)
                      ? variant.images.filter(Boolean)
                      : [];
                    return (
                      <div
                        key={variant._id || `variant-${idx}`}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <p>
                            <span className="font-semibold text-gray-800">Color:</span>{" "}
                            {variant.color || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-800">Size:</span>{" "}
                            {variant.size || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-800">Price:</span>{" "}
                            {formatPrice(variant.price)}
                          </p>
                        </div>
                        {images.length > 0 ? (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {images.map((src, imgIdx) => (
                              <img
                                key={`${src}-${imgIdx}`}
                                src={src}
                                alt={`Variant ${idx + 1} image ${imgIdx + 1}`}
                                className="h-16 w-16 shrink-0 rounded-md object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/64";
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-gray-500">No variant images</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No variants</p>
              )}
            </DetailField>

            <DetailField label="User Reviews">
              {Array.isArray(product.userReviews) && product.userReviews.length > 0 ? (
                <ul className="space-y-2">
                  {product.userReviews.map((rev, idx) => (
                    <li key={rev?._id || idx} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {rev?.user?.name || "User"} — {rev?.stars || 0}/5
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev?._id)}
                          className="rounded border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 text-sm">{rev?.review || "-"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews yet</p>
              )}
            </DetailField>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <Link
              to={`/admin/edit-product/${product._id}`}
              className="inline-block rounded-md px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "#3D294D" }}
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
