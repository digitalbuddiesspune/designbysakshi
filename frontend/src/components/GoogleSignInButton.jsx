import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let googleScriptPromise = null;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-gsi="true"]');
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google"));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
};

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const callbacksRef = useRef({ onSuccess, onError });

  useEffect(() => {
    callbacksRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    let cancelled = false;

    const handleCredential = async (response) => {
      if (!response?.credential) {
        callbacksRef.current.onError?.("Google sign-in failed");
        return;
      }
      setBusy(true);
      try {
        const res = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Google sign-in failed");
        }
        callbacksRef.current.onSuccess?.(data);
      } catch (error) {
        callbacksRef.current.onError?.(error.message || "Google sign-in failed");
      } finally {
        setBusy(false);
      }
    };

    const setup = async () => {
      try {
        await loadGoogleScript();
        // Wait until the container is mounted and measurable
        for (let i = 0; i < 10 && !cancelled; i += 1) {
          if (buttonRef.current?.offsetWidth) break;
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        buttonRef.current.innerHTML = "";
        const width = Math.max(buttonRef.current.offsetWidth || 320, 280);
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width,
        });
        if (!cancelled) setReady(true);
      } catch (error) {
        if (!cancelled) {
          callbacksRef.current.onError?.(error.message || "Google sign-in unavailable");
        }
      }
    };

    setup();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        className={`flex min-h-10 w-full items-center justify-center overflow-hidden [&>div]:w-full ${
          disabled || busy ? "pointer-events-none opacity-60" : ""
        }`}
      />
      {!ready && (
        <p className="text-center text-xs text-gray-500">Loading Google…</p>
      )}
    </div>
  );
};

export default GoogleSignInButton;
