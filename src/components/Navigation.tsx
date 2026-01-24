"use client";

import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SubscribeDropdown from "./SubscribeDropdown";
import EmailSubscriptionModal from "./EmailSubscriptionModal";
import SearchModal from "./SearchModal";
import Image from "next/image";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();

  // Function to get the correct Videos href based on current location
  const getVideosHref = () => {
    return pathname === "/" ? "#videos" : "/#videos";
  };

  const navItems = [
    { label: "Home", href: "/", isLink: true },
    { label: "Videos", href: getVideosHref(), isLink: false, isVideos: true },
    { label: "Blog", href: "/blog", isLink: true },
    { label: "Coaching", href: "/coaching", isLink: true },
    { label: "Newsletter", href: "#newsletter", isLink: false, isModal: true },
    { label: "About", href: "/about-sergio", isLink: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="editorial-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/sergio-avedian-logo.png"
              alt="Sergio Avedian" 
              width={200}
              height={80}
              className="h-20 w-auto py-2 transition-opacity duration-200 hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => 
              item.isLink ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated"
                >
                  {item.label}
                </Link>
              ) : item.isModal ? (
                <button
                  key={item.label}
                  onClick={() => setIsNewsletterModalOpen(true)}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated"
                >
                  {item.label}
                </button>
              ) : item.isVideos ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:glow-primary"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <SubscribeDropdown variant="cta" size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-md" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out bg-background border-b border-border/30 absolute left-0 right-0 top-full shadow-xl",
            isMenuOpen
              ? "max-h-[85vh] opacity-100 pb-4 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="container mx-auto px-4">
        <div className="space-y-3 pt-4 border-t border-nav-border">
            {navItems.map((item) => 
              item.isLink ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2"
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
                  className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2 text-left w-full"
                >
                  {item.label}
                </button>
              ) : item.isVideos ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
            <div className="flex items-center space-x-3 pt-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchModalOpen(true);
                }}
              >
                <Search className="h-4 w-4" />
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