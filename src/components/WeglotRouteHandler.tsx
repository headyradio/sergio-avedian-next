"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches for Next.js client-side route changes and forces Weglot
 * to re-translate the entire page via addNodes(document.body).
 *
 * Key insight: Next.js client-side navigation replaces DOM nodes that
 * Weglot has already translated, causing them to revert to English.
 * Calling addNodes(body) tells Weglot to re-scan everything.
 */
const WeglotRouteHandler = () => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Clear any pending refresh from a previous navigation
    if (timerRef.current) clearTimeout(timerRef.current);

    // Wait for React to finish rendering the new route, then re-translate
    timerRef.current = setTimeout(() => {
      if (
        typeof window === "undefined" ||
        !window.Weglot ||
        !window.Weglot.initialized
      )
        return;

      const currentLang = window.Weglot.getCurrentLang();
      if (!currentLang || currentLang === "en") return;

      // addNodes re-scans the given subtree and translates any new text
      // We target document.body so the header, footer, AND content are covered
      if (typeof window.Weglot.addNodes === "function") {
        window.Weglot.addNodes(document.body);
      }
    }, 500);
  }, [pathname]);

  return null;
};

export default WeglotRouteHandler;

