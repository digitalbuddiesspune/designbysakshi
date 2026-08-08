import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SectionBanner = ({
  sectionKey,
  fallbackDesktop = "",
  fallbackMobile = "",
  fallbackLink = "/",
  className = "",
  alt = "DesignBySakshi banner",
}) => {
  const [banner, setBanner] = useState({
    imageDesktop: fallbackDesktop,
    imageMobile: fallbackMobile,
    link: fallbackLink,
    active: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/homepage-sections/banners/${sectionKey}`);
        const data = await res.json();
        if (!res.ok) return;
        setBanner({
          imageDesktop: data.imageDesktop || fallbackDesktop,
          imageMobile: data.imageMobile || fallbackMobile,
          link: data.link || fallbackLink,
          active: data.active !== false,
        });
      } catch (error) {
        console.error(`Error fetching ${sectionKey} banner:`, error);
      }
    };
    load();
  }, [sectionKey, fallbackDesktop, fallbackMobile, fallbackLink]);

  if (banner.active === false) return null;
  if (!banner.imageDesktop && !banner.imageMobile) return null;

  const href = banner.link || fallbackLink || "/";

  return (
    <section className={className}>
      <Link to={href} className="block w-full">
        {banner.imageDesktop ? (
          <img
            src={banner.imageDesktop}
            alt={alt}
            className="hidden sm:block w-full h-auto object-cover"
          />
        ) : null}
        {banner.imageMobile || banner.imageDesktop ? (
          <img
            src={banner.imageMobile || banner.imageDesktop}
            alt={alt}
            className="block sm:hidden w-full h-auto object-cover"
          />
        ) : null}
      </Link>
    </section>
  );
};

export default SectionBanner;
