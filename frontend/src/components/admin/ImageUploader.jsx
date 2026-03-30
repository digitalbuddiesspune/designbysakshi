import { useCallback, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ImageUploader = ({ label = "Upload Image", value, onChange, folder = "designbysakshi" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    setError("");
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      onChange?.(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const browse = () => inputRef.current?.click();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
        {label}
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-lg border border-dashed p-4 text-center cursor-pointer"
        style={{ borderColor: "var(--brand-lavender-soft)" }}
        onClick={browse}
      >
        <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
          Drag & drop image here, or click to choose
        </p>
        {uploading && <p className="text-xs mt-2">Uploading...</p>}
        {error && <p className="text-xs mt-2 text-red-600">{error}</p>}
        {value && (
          <div className="mt-3 flex items-center justify-center">
            <img src={value} alt="preview" className="max-h-28 rounded" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUploader;

