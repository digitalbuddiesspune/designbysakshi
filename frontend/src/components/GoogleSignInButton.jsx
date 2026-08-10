import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
// OAuth Web Client IDs are public; keep as production fallback when env/API is missing.
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

const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
    />
    <path
      fill="#34A853"
      d="M5.3 14.3l-.8.6-2.5 2C3.5 20.1 7.5 23 12 23c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-6-4.4z"
    />
    <path
      fill="#4A90E2"
      d="M3.3 7.1C2.5 8.7 2 10.3 2 12s.5 3.3 1.3 4.9l3.3-2.6C6.1 13.1 6 12.6 6 12s.1-1.1.3-1.6L3.3 7.1z"
    />
    <path
      fill="#FBBC05"
      d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 2.9 14.7 2 12 2 7.5 2 3.5 4.9 2 9.1l3.3 2.6C6.9 8.9 9.2 6 12 6z"
    />
  </svg>
);

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const hiddenBtnRef = useRef(null);
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
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Keep an official GIS button (hidden) so Google popup/auth flow stays supported.
        if (hiddenBtnRef.current) {
          hiddenBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(hiddenBtnRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            width: 320,
          });
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

  const handleClick = () => {
    if (disabled || busy || !ready) return;
    const googleBtn = hiddenBtnRef.current?.querySelector("div[role='button'], button, div");
    if (googleBtn) {
      googleBtn.click();
      return;
    }
    // Fallback: prompt One Tap / account chooser
    try {
      window.google?.accounts?.id?.prompt();
    } catch {
      callbacksRef.current.onError?.("Google sign-in unavailable");
    }
  };

  if (!clientId) return null;

  return (
    <>
      <div className="mb-4 w-full">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || busy || !ready}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {busy ? "Signing in..." : ready ? "Continue with Google" : "Loading Google…"}
        </button>
        <div ref={hiddenBtnRef} className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden />
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
