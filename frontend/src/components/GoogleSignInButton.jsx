import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
// OAuth Web Client IDs are public; used when Vite/API env is missing in production.
const FALLBACK_GOOGLE_CLIENT_ID =
  "82079364642-n4sab2bd3695c6gad9bkiucfsud9rhjm.apps.googleusercontent.com";
const ENV_GOOGLE_CLIENT_ID = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

let googleScriptPromise = null;
let cachedClientIdPromise = null;

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
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google")),
        { once: true },
      );
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

const resolveGoogleClientId = async () => {
  if (ENV_GOOGLE_CLIENT_ID) return ENV_GOOGLE_CLIENT_ID;

  if (!cachedClientIdPromise) {
    cachedClientIdPromise = fetch(`${API_URL}/auth/google-config`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return "";
        return String(data?.clientId || "").trim();
      })
      .catch(() => "");
  }

  const fromApi = await cachedClientIdPromise;
  return fromApi || FALLBACK_GOOGLE_CLIENT_ID;
};

/** Official multicolor Google "G" mark */
const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const overlayRef = useRef(null);
  const [clientId, setClientId] = useState(
    ENV_GOOGLE_CLIENT_ID || FALLBACK_GOOGLE_CLIENT_ID,
  );
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const callbacksRef = useRef({ onSuccess, onError });

  useEffect(() => {
    callbacksRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      const id = await resolveGoogleClientId();
      if (!cancelled && id) setClientId(id);
    };
    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!clientId) return undefined;
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
        for (let i = 0; i < 12 && !cancelled; i += 1) {
          if (overlayRef.current?.offsetWidth) break;
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        if (cancelled || !overlayRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        overlayRef.current.innerHTML = "";
        const width = Math.max(overlayRef.current.offsetWidth || 320, 280);
        window.google.accounts.id.renderButton(overlayRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width,
        });

        // Stretch Google's iframe/button to cover our custom button fully.
        const rendered = overlayRef.current.firstElementChild;
        if (rendered) {
          rendered.style.width = "100%";
          rendered.style.height = "100%";
        }

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
  }, [clientId]);

  if (!clientId) return null;

  return (
    <>
      <div className="relative mb-4 w-full">
        {/* Visual custom button (icon + label) */}
        <div
          className={`flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ${
            disabled || busy ? "opacity-60" : ""
          }`}
        >
          <GoogleIcon />
          <span>{busy ? "Signing in..." : "Continue with Google"}</span>
        </div>

        {/* Real Google button overlays the custom UI so clicks always work */}
        <div
          ref={overlayRef}
          className={`absolute inset-0 z-10 overflow-hidden rounded-lg [&>div]:h-full [&>div]:w-full ${
            disabled || busy ? "pointer-events-none" : "cursor-pointer"
          }`}
          style={{ opacity: 0.011 }}
          aria-label="Continue with Google"
        />

        {!ready && (
          <p className="mt-2 text-center text-xs text-gray-500">Loading Google…</p>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </>
  );
};

export default GoogleSignInButton;
