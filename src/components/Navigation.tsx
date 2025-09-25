import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import SubscribeDropdown from "./SubscribeDropdown";
import EmailSubscriptionModal from "./EmailSubscriptionModal";
import SearchModal from "./SearchModal";
import logoImage from "@/assets/sergio-avedian-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();

  // Function to get the correct Videos href based on current location
  const getVideosHref = () => {
    return location.pathname === "/" ? "#videos" : "/#videos";
  };

  const navItems = [
    { label: "Videos", href: getVideosHref(), isExternal: false, isVideos: true },
    { label: "Blog", href: "/blog", isExternal: true },
    { label: "Coaching", href: "/coaching", isExternal: true },
    { label: "Newsletter", href: "#newsletter", isExternal: false, isModal: true },
    { label: "About", href: "/about-sergio", isExternal: true },
  ];

  return (
    <nav className="sticky top-0 z-50 nav-floating">
      <div className="editorial-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Sergio Avedian" 
              className="h-20 w-auto py-2 transition-opacity duration-200 hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => 
              item.isExternal ? (
                <Link
                  key={item.label}
                  to={item.href}
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
            <SubscribeDropdown variant="cta" size="sm" className="cta-electric" />
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
            "md:hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-64 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
        <div className="space-y-3 pt-4 border-t border-nav-border">
            {navItems.map((item) => 
              item.isExternal ? (
                <Link
                  key={item.label}
                  to={item.href}
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