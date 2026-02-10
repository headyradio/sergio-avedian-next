"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Weglot: any;
  }
}

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "mobile";
}

export default function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Initialize Weglot status checking
    const checkWeglot = () => {
      if (typeof window !== "undefined" && window.Weglot) {
        setCurrentLang(window.Weglot.getCurrentLang());
        
        // Listen for language changes
        window.Weglot.on("languageChanged", (newLang: string) => {
          setCurrentLang(newLang);
        });
        
        // Listen for initialization
        window.Weglot.on("initialized", () => {
          setCurrentLang(window.Weglot.getCurrentLang());
        });
      }
    };

    // Check immediately and then poll briefly in case script loads async
    checkWeglot();
    const interval = setInterval(checkWeglot, 500);
    
    // Clear interval after 5 seconds to stop polling
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const toggleLanguage = () => {
    if (typeof window !== "undefined" && window.Weglot) {
      const nextLang = currentLang === "en" ? "es" : "en";
      window.Weglot.switchTo(nextLang);
    } else {
      console.warn("Weglot not loaded yet");
    }
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={toggleLanguage}
        className={cn(
          "flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2 w-full text-left",
          className
        )}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang === "en" ? "Español" : "English"}</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "gap-2 text-text-secondary hover:text-text-primary hover:bg-transparent font-medium",
        className
      )}
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase text-xs tracking-wider">
        {currentLang === "en" ? "ES" : "EN"}
      </span>
    </Button>
  );
}
