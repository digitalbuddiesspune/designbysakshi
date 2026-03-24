import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const CollectionPage = ({ heroImage, subcategoryName, title }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const guestId = useMemo(() => getGuestId(), []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/products?category=${encodeURIComponent("Latest Collection")}&subcategory=${encodeURIComponent(subcategoryName)}`
        );
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching collection products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subcategoryName]);

  const handleAddToCart = async (productId) => {
    try {
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, guestId }),
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full">
        <img src={heroImage} alt={title} className="block w-full h-auto object-cover" />
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6">{title}</h1>

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
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                      style={{ background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-purple) 100%)" }}
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

export default CollectionPage;
