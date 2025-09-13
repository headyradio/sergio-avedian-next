import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SubscribeDropdown from "./SubscribeDropdown";
import logoImage from "@/assets/sergio-avedian-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Videos", href: "#videos" },
    { label: "Blog", href: "#blog" },
    { label: "Categories", href: "#categories" },
    { label: "Newsletter", href: "#newsletter" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 nav-floating">
      <div className="editorial-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="Sergio Avedian" 
              className="h-20 w-auto py-2 transition-opacity duration-200 hover:opacity-80"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-medium link-animated"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="hover:glow-primary">
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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center space-x-3 pt-2">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <SubscribeDropdown variant="cta" size="sm" className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;