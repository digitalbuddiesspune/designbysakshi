import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
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
  return cachedClientIdPromise;
};

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const buttonRef = useRef(null);
  const [clientId, setClientId] = useState(ENV_GOOGLE_CLIENT_ID || "");
  const [configChecked, setConfigChecked] = useState(Boolean(ENV_GOOGLE_CLIENT_ID));
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
      if (cancelled) return;
      setClientId(id);
      setConfigChecked(true);
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
        for (let i = 0; i < 10 && !cancelled; i += 1) {
          if (buttonRef.current?.offsetWidth) break;
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
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
  }, [clientId]);

  if (!configChecked) {
    return null;
  }

  if (!clientId) {
    return null;
  }

  return (
    <>
      <div className="mb-4 w-full">
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
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </>
  );
};

export default GoogleSignInButton;
