"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentValue = "granted" | "denied";

export default function CookieConsentBanner() {
  const [storedConsent, setStoredConsent] = useState<ConsentValue | null | "loading">("loading");
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent") as ConsentValue | null;
    setStoredConsent(stored);

    const handleOpen = () => setPreferencesOpen(true);
    window.addEventListener("openCookiePreferences", handleOpen);
    return () => window.removeEventListener("openCookiePreferences", handleOpen);
  }, []);

  const handleDecision = (decision: ConsentValue) => {
    localStorage.setItem("cookie_consent", decision);
    setStoredConsent(decision);
    setPreferencesOpen(false);
    window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: decision }));
  };

  // Show if: no decision yet, or preferences re-opened from footer
  const visible = storedConsent !== "loading" && (storedConsent === null || preferencesOpen);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-3xl mx-auto bg-black border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5 md:p-6">
          <p className="text-sm font-semibold text-white mb-2">Cookie Preferences</p>
          <p className="text-xs text-text-muted leading-relaxed">
            We use Google Analytics to understand how visitors use this site. Under California law
            (CIPA &amp; CCPA), we require your explicit consent before enabling any tracking or
            cookies. No data is collected until you accept.{" "}
            <Link href="/privacy-policy" className="text-primary underline hover:no-underline">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/cookie-policy" className="text-primary underline hover:no-underline">
              Cookie Policy
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 pb-5 md:px-6 md:pb-6">
          <button
            onClick={() => handleDecision("denied")}
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-white/25 text-white/80 hover:text-white hover:border-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Decline
          </button>
          <button
            onClick={() => handleDecision("granted")}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
