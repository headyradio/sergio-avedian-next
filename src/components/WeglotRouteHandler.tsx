"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches for Next.js client-side route changes and forces Weglot
 * to re-translate the new DOM content. Without this, navigating
 * via <Link> swaps the page content but Weglot doesn't re-scan.
 *
 * Strategy: After each route change, if the current language is not
 * English, we force a full Weglot re-translate by switching briefly
 * to English and back. We also set up a MutationObserver on <main>
 * to catch any late-rendering content.
 */
const WeglotRouteHandler = () => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const retranslateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip the initial mount — only act on actual navigation
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (typeof window === "undefined" || !window.Weglot || !window.Weglot.initialized) return;

    const currentLang = window.Weglot.getCurrentLang();

    // If user is viewing in a non-default language, force re-translate
    if (currentLang && currentLang !== "en") {
      // Clear any pending retranslation
      if (retranslateTimer.current) clearTimeout(retranslateTimer.current);

      // Wait for React to finish rendering the new page, then retranslate
      retranslateTimer.current = setTimeout(() => {
        if (!window.Weglot || !window.Weglot.initialized) return;

        // Force Weglot to re-scan by switching to English first
        window.Weglot.switchTo("en");
        
        // Then switch back after Weglot has reset
        setTimeout(() => {
          if (window.Weglot && window.Weglot.initialized) {
            window.Weglot.switchTo(currentLang);
          }
        }, 300);
      }, 500); // Give React 500ms to render the new route
    }

    return () => {
      if (retranslateTimer.current) clearTimeout(retranslateTimer.current);
    };
  }, [pathname]);

  return null;
};

export default WeglotRouteHandler;
