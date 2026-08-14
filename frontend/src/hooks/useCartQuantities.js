import { useState, useEffect, useCallback } from "react";
import { flyToCart } from "../utils/flyToCart.js";
import { getGuestId } from "../utils/guestId.js";

const API_URL = import.meta.env.VITE_API_URL;

const cartLineKey = (productId, variantId = "") =>
  variantId ? `${productId}:${variantId}` : String(productId);

export function useCartQuantities() {
  const [cartQuantities, setCartQuantities] = useState({});
  const [cartBusyId, setCartBusyId] = useState(null);

  const loadCartQuantities = useCallback(async () => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`${API_URL}/cart?guestId=${encodeURIComponent(guestId)}`);
      const data = res.ok ? await res.json() : { items: [] };
      const qtyMap = {};
      (data?.items || []).forEach((item) => {
        const id = String(item?.product?._id || item?.product || "");
        if (!id) return;
        const variantId = item?.variantId || "";
        const key = cartLineKey(id, variantId);
        const qty = Number(item.quantity || 0);
        qtyMap[key] = qty;
        // Keep product-level total if item has a specific variant (key !== id)
        if (variantId) {
          qtyMap[id] = (qtyMap[id] || 0) + qty;
        }
      });
      setCartQuantities(qtyMap);
    } catch (error) {
      console.error("Error loading cart quantities:", error);
    }
  }, []);

  useEffect(() => {
    loadCartQuantities();
    const onCartUpdated = () => loadCartQuantities();
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, [loadCartQuantities]);

  const addToCart = useCallback(
    async (productId, imageEl, variantId = "") => {
      try {
        const key = cartLineKey(productId, variantId);
        setCartBusyId(key);
        if (imageEl) flyToCart(imageEl);
        const guestId = getGuestId();
        const res = await fetch(`${API_URL}/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1, guestId, variantId: variantId || "" }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data?.error || "Could not add to cart.");
          await loadCartQuantities();
          return;
        }
        setCartQuantities((prev) => {
          const updated = { ...prev };
          updated[key] = (updated[key] || 0) + 1;
          if (variantId) {
            updated[String(productId)] = (updated[String(productId)] || 0) + 1;
          }
          return updated;
        });
        window.dispatchEvent(new Event("cart-updated"));
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Could not add to cart. Please try again.");
      } finally {
        setCartBusyId(null);
      }
    },
    [loadCartQuantities],
  );

  const setCartQuantity = useCallback(
    async (productId, nextQty, variantId = "") => {
      try {
        const key = cartLineKey(productId, variantId);
        setCartBusyId(key);
        const guestId = getGuestId();
        const res = await fetch(`${API_URL}/cart/set-quantity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            quantity: nextQty,
            guestId,
            variantId: variantId || "",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data?.error || "Could not update cart quantity.");
          await loadCartQuantities();
          return;
        }
        setCartQuantities((prev) => {
          const updated = { ...prev };
          const oldLineQty = updated[key] || 0;
          const diff = nextQty - oldLineQty;
          if (nextQty <= 0) {
            delete updated[key];
          } else {
            updated[key] = nextQty;
          }
          if (variantId) {
            const newProductTotal = Math.max(0, (updated[String(productId)] || 0) + diff);
            if (newProductTotal <= 0) {
              delete updated[String(productId)];
            } else {
              updated[String(productId)] = newProductTotal;
            }
          }
          return updated;
        });
        window.dispatchEvent(new Event("cart-updated"));
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        alert("Could not update cart. Please try again.");
      } finally {
        setCartBusyId(null);
      }
    },
    [loadCartQuantities],
  );

  return { cartQuantities, cartBusyId, addToCart, setCartQuantity };
}
