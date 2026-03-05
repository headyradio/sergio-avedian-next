"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Extend Window to include gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function updateGtagConsent(decision: "granted" | "denied") {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: decision,
      ad_storage: decision,
      ad_user_data: decision,
      ad_personalization: decision,
    });
  }
}

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (stored === "granted") {
      setConsentGranted(true);
      updateGtagConsent("granted");
    }

    const handleUpdate = (e: Event) => {
      const decision = (e as CustomEvent<string>).detail as "granted" | "denied";
      if (decision === "granted") {
        setConsentGranted(true);
        updateGtagConsent("granted");
      } else {
        updateGtagConsent("denied");
        setConsentGranted(false);
      }
    };

    window.addEventListener("cookieConsentUpdated", handleUpdate);
    return () => window.removeEventListener("cookieConsentUpdated", handleUpdate);
  }, []);

  // No GA_ID configured yet — placeholder ready for when the user adds it
  if (!GA_ID || !consentGranted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: true });
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        });
      `}</Script>
    </>
  );
}
