import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "shop-by-category", label: "Shop By Category" },
  { id: "new-arrival", label: "New Arrival" },
  { id: "bestseller", label: "Bestseller" },
  { id: "shop-by-collection", label: "Shop By Collection" },
];

const emptyBanner = {
  title: "",
  imageDesktop: "",
  imageMobile: "",
  link: "",
  active: true,
};

const AdminHomepageSections = () => {
  const [activeTab, setActiveTab] = useState("shop-by-category");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [banners, setBanners] = useState({
    "shop-by-category": { ...emptyBanner },
    "new-arrival": { ...emptyBanner },
    bestseller: { ...emptyBanner },
    "shop-by-collection": { ...emptyBanner },
  });

  const load = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(`${API_URL}/homepage-sections`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load homepage sections");

      setCategories(Array.isArray(data.shopByCategory) ? data.shopByCategory : []);
      setCollections(Array.isArray(data.shopByCollection) ? data.shopByCollection : []);

      const nextBanners = { ...banners };
      TABS.forEach((tab) => {
        const banner = data?.banners?.[tab.id];
        nextBanners[tab.id] = {
          title: banner?.title || tab.label,
          imageDesktop: banner?.imageDesktop || "",
          imageMobile: banner?.imageMobile || "",
          link: banner?.link || "",
          active: banner?.active !== false,
        };
      });
      setBanners(nextBanners);
    } catch (error) {
      setMessage(error.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBannerField = (key, field, value) => {
    setBanners((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const saveBanner = async (key) => {
    try {
      setSaving(true);
      setMessage("");
      const res = await fetch(`${API_URL}/homepage-sections/banners/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners[key] || {}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to save banner");
      setMessage(`${TABS.find((t) => t.id === key)?.label || "Section"} banner saved.`);
    } catch (error) {
      setMessage(error.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveCategoryImage = async (id, image) => {
    try {
      setSaving(true);
      setMessage("");
      const res = await fetch(`${API_URL}/homepage-sections/shop-by-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update category image");
      setCategories((prev) => prev.map((cat) => (cat._id === id ? data : cat)));
      setMessage("Category image updated.");
    } catch (error) {
      setMessage(error.message || "Failed to update category image");
    } finally {
      setSaving(false);
    }
  };

  const saveCollectionImage = async (id, image) => {
    try {
      setSaving(true);
      setMessage("");
      const res = await fetch(`${API_URL}/homepage-sections/shop-by-collection/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update collection image");
      setCollections((prev) => prev.map((item) => (item._id === id ? data : item)));
      setMessage("Collection image updated.");
    } catch (error) {
      setMessage(error.message || "Failed to update collection image");
    } finally {
      setSaving(false);
    }
  };

  const renderBannerEditor = (key, extras = null) => {
    const banner = banners[key] || emptyBanner;
    return (
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Title</label>
            <input
              type="text"
              value={banner.title}
              onChange={(e) => updateBannerField(key, "title", e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Link</label>
            <input
              type="text"
              value={banner.link}
              onChange={(e) => updateBannerField(key, "link", e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="/new-arrival"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ImageUploader
            label="Desktop Image"
            value={banner.imageDesktop}
            folder="designbysakshi/homepage-sections"
            onChange={(url) => updateBannerField(key, "imageDesktop", url)}
          />
          <ImageUploader
            label="Mobile Image"
            value={banner.imageMobile}
            folder="designbysakshi/homepage-sections"
            onChange={(url) => updateBannerField(key, "imageMobile", url)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={banner.active}
            onChange={(e) => updateBannerField(key, "active", e.target.checked)}
          />
          Active
        </label>

        {extras}

        <button
          type="button"
          disabled={saving}
          onClick={() => saveBanner(key)}
          className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "#3D294D" }}
        >
          {saving ? "Saving..." : "Save Banner"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        Loading homepage sections...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Homepage Section Images</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload and update photos for Shop By Category, New Arrival, Bestseller, and Shop By
          Collection.
        </p>
      </div>

      {message ? (
        <div
          className={`mb-4 rounded-md px-3 py-2 text-sm ${
            message.toLowerCase().includes("fail")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-[#3D294D] text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shop-by-category" ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These images appear as circular category photos on the homepage. You can also manage
            full category details from{" "}
            <Link to="/admin/categories" className="font-semibold" style={{ color: "#3D294D" }}>
              My Categories
            </Link>
            .
          </p>
          {categories.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
              No categories found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((cat) => (
                <div key={cat._id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500">/{cat.slug}</p>
                    </div>
                  </div>
                  <ImageUploader
                    label="Category Image"
                    value={cat.image || ""}
                    folder="designbysakshi/categories"
                    compact
                    onChange={(url) => saveCategoryImage(cat._id, url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === "new-arrival"
        ? renderBannerEditor(
            "new-arrival",
            <p className="text-xs text-gray-500">
              Shown above New Arrival products on the homepage.
            </p>,
          )
        : null}

      {activeTab === "bestseller"
        ? renderBannerEditor(
            "bestseller",
            <p className="text-xs text-gray-500">
              Shown above Bestseller products on the homepage.
            </p>,
          )
        : null}

      {activeTab === "shop-by-collection" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              These images appear in the Shop By Collection slider. For routes and priority, use{" "}
              <Link
                to="/admin/collections-showcase"
                className="font-semibold"
                style={{ color: "#3D294D" }}
              >
                Shop By Collection
              </Link>
              .
            </p>
            <Link
              to="/admin/add-collection"
              className="rounded-md px-3 py-2 text-xs font-semibold text-white"
              style={{ background: "#3D294D" }}
            >
              + Add Collection
            </Link>
          </div>
          {collections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
              No collections found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {collections.map((item) => (
                <div key={item._id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.route}</p>
                  </div>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-3 max-h-28 w-auto rounded object-contain"
                    />
                  ) : null}
                  <ImageUploader
                    label="Collection Image"
                    value={item.image || ""}
                    folder="designbysakshi/collections"
                    onChange={(url) => saveCollectionImage(item._id, url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminHomepageSections;
