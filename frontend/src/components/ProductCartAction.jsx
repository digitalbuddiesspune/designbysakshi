import React from "react";
import CartQuantityControls from "./CartQuantityControls.jsx";

const ProductCartAction = ({
  productId,
  cartQuantity = 0,
  cartBusy = false,
  getImageEl,
  onAdd,
  onSetQuantity,
  buttonClassName = "flex min-h-8 w-full items-center justify-center rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60 sm:min-h-9 sm:text-base",
}) => {
  if (cartQuantity > 0) {
    return (
      <div onClick={(e) => e.stopPropagation()} role="presentation">
        <CartQuantityControls
          quantity={cartQuantity}
          disabled={cartBusy}
          onDecrease={() => onSetQuantity(productId, cartQuantity - 1)}
          onIncrease={() => onSetQuantity(productId, cartQuantity + 1)}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      style={{ background: "#3D294D" }}
      disabled={cartBusy}
      onClick={(e) => {
        e.stopPropagation();
        const imageEl = getImageEl?.();
        onAdd(productId, imageEl);
      }}
    >
      {cartBusy ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default ProductCartAction;
