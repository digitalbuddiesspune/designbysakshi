import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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
        <p style={{ color: "var(--brand-dark)" }}>
          {error || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2">
        {/* Left: Image */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-gray-900"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            {product.name}
          </h1>

          <p className="text-xl font-bold text-gray-900">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>

          <p className="text-sm text-gray-600">
            {product.inStock && product.stock > 0
              ? `In stock (${product.stock} available)`
              : "Out of stock"}
          </p>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-700">
              {product.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)",
              }}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="flex-1 rounded-full border px-4 py-2 text-sm font-semibold text-center transition hover:bg-gray-100"
              style={{
                borderColor: "var(--brand-lavender-soft)",
                color: "var(--brand-dark)",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

