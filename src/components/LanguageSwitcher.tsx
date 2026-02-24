"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    Weglot: any;
  }
}

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

const LanguageSwitcher = ({ variant = "desktop" }: LanguageSwitcherProps) => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const checkWeglot = () => {
      if (typeof window !== "undefined" && window.Weglot && window.Weglot.initialized) {
        setCurrentLang(window.Weglot.getCurrentLang());
      }
    };

    if (typeof window !== "undefined" && window.Weglot) {
      try {
        window.Weglot.on("languageChanged", (newLang: string) => {
          setCurrentLang(newLang);
        });
        window.Weglot.on("initialized", () => {
          setCurrentLang(window.Weglot.getCurrentLang());
        });
      } catch (e) {
        // Ignore errors during hydration
      }
    }

    checkWeglot();
    const interval = setInterval(checkWeglot, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const toggleLanguage = () => {
    if (typeof window !== "undefined" && window.Weglot && window.Weglot.initialized) {
      const nextLang = currentLang === "en" ? "es" : "en";
      window.Weglot.switchTo(nextLang);
    }
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2 w-full"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang === "en" ? "Español" : "English"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium text-sm"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLang === "en" ? "Español" : "English"}</span>
    </button>
  );
};

export default LanguageSwitcher;
