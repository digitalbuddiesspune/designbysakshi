function getVisibleRect(el) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? el : null;
}

export function getVisibleProductImage(selector) {
  const images = document.querySelectorAll(selector);
  for (const img of images) {
    const visible = getVisibleRect(img);
    if (visible) return visible;
  }
  return images[0] || null;
}

function getCartTarget() {
  const isMobile = window.innerWidth < 1024;
  const primary = document.getElementById(isMobile ? "mobile-cart-icon" : "header-cart-icon");
  const fallback = document.getElementById(isMobile ? "header-cart-icon" : "mobile-cart-icon");
  return getVisibleRect(primary) || getVisibleRect(fallback) || primary || fallback;
}

export function flyToCart(imageEl) {
  if (!imageEl || typeof window === "undefined") return;

  const source = getVisibleRect(imageEl) || imageEl;
  const cartEl = getCartTarget();
  if (!cartEl) return;

  const start = source.getBoundingClientRect();
  const end = cartEl.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = source.currentSrc || source.src;
  flyer.alt = "";
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`,
    height: `${start.height}px`,
    objectFit: "cover",
    borderRadius: "8px",
    zIndex: "10000",
    pointerEvents: "none",
    transition: "none",
    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
  });
  document.body.appendChild(flyer);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyer.style.transition = "transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.65s ease";
      flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
      flyer.style.opacity = "0.25";
    });
  });

  window.setTimeout(() => {
    flyer.remove();
    window.dispatchEvent(new Event("cart-bump"));
  }, 680);
}
