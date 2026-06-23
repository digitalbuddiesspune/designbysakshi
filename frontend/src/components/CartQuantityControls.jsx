import React from "react";

const CartQuantityControls = ({ quantity, onDecrease, onIncrease, disabled = false }) => (
  <div className="flex w-full items-center overflow-hidden rounded-lg bg-[#3D294D]/10">
    <button
      type="button"
      onClick={onDecrease}
      disabled={disabled}
      className="flex h-8 w-9 items-center justify-center bg-[#3D294D] text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40 sm:h-9"
      aria-label="Decrease quantity"
    >
      −
    </button>
    <div className="flex-1 text-center text-sm font-semibold leading-8 text-gray-900 sm:leading-9">
      {quantity}
    </div>
    <button
      type="button"
      onClick={onIncrease}
      disabled={disabled}
      className="flex h-8 w-9 items-center justify-center bg-[#3D294D] text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40 sm:h-9"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export default CartQuantityControls;
