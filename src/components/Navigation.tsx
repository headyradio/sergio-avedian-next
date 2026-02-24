"use client";

import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SubscribeDropdown from "./SubscribeDropdown";
import EmailSubscriptionModal from "./EmailSubscriptionModal";
import SearchModal from "./SearchModal";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getVideosHref = () => {
    return pathname === "/" ? "#videos" : "/#videos";
  };

  const navItems = [
    { label: "Videos", href: getVideosHref(), isLink: false, isVideos: true },
    { label: "Blog", href: "/blog", isLink: true },
    { label: "Coaching", href: "/coaching", isLink: true },
    { label: "Newsletter", href: "#newsletter", isLink: false, isModal: true },
    { label: "About", href: "/about-sergio", isLink: true },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-black/90 backdrop-blur-md shadow-md border-b border-white/10" : "bg-black border-b border-white/10"
    )}>
      <div className="editorial-container">
        {/* Desktop: 3-column grid — links | logo | actions */}
        <div className="hidden md:grid grid-cols-3 items-center h-14">
          {/* Left — Nav Links */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const linkClass = "text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated whitespace-nowrap";
              return item.isLink ? (
                <Link key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ) : item.isModal ? (
                <button key={item.label} onClick={() => setIsNewsletterModalOpen(true)} className={linkClass}>
                  {item.label}
                </button>
              ) : (
                <a key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Center — Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/sergio-avedian-logo.png"
                alt="Sergio Avedian"
                width={160}
                height={56}
                className="h-10 w-auto transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 group-hover:drop-shadow-md"
                priority
              />
            </Link>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center justify-end space-x-4">
            <LanguageSwitcher />
            <div className="h-4 w-px bg-border/40" />
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:text-text-primary h-8 w-8"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <SubscribeDropdown variant="cta" size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-1.5 rounded-md tracking-wide text-xs" />
          </div>
        </div>

        {/* Mobile: logo left, hamburger right */}
        <div className="flex md:hidden items-center justify-between h-12">
          <Link href="/" className="flex items-center group">
            <Image
              src="/sergio-avedian-logo.png"
              alt="Sergio Avedian"
              width={140}
              height={48}
              className="h-8 w-auto transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 group-hover:drop-shadow-md"
              priority
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="touch-target h-8 w-8"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out bg-black border-b border-white/10 absolute left-0 right-0 top-full",
            isMenuOpen
              ? "max-h-[85vh] opacity-100 pb-6 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="px-6 py-4">
            <div className="space-y-1 pt-4">
              {navItems.map((item) => 
                item.isLink ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-3 text-base tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : item.isModal ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsNewsletterModalOpen(true);
                    }}
                    className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-3 text-base text-left w-full tracking-wide"
                  >
                    {item.label}
                  </button>
                ) : item.isVideos ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-3 text-base tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-3 text-base tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
              {/* Mobile Language Switcher */}
              <div className="py-3 border-b border-border/30 mb-3">
                <LanguageSwitcher variant="mobile" />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchModalOpen(true);
                  }}
                  aria-label="Search"
                  className="touch-target"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <SubscribeDropdown variant="cta" size="sm" className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Modal */}
      <EmailSubscriptionModal
        open={isNewsletterModalOpen}
        onOpenChange={setIsNewsletterModalOpen}
      />

      {/* Search Modal */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </nav>
  );
};

export default Navigation;