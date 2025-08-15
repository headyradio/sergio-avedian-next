import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <nav className="sticky top-0 z-50 bg-nav-background/95 backdrop-blur-md">
      <div className="editorial-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-medium text-text-primary tracking-tight">
              Sergio Avedian
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="interactive-subtle p-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="cta-primary px-6 py-2 font-medium">
              Subscribe
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-64 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="space-y-4 pt-6">
            <div className="divider-subtle mb-4" />
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center space-x-4 pt-4">
              <Button variant="ghost" size="sm" className="interactive-subtle p-2">
                <Search className="h-5 w-5" />
              </Button>
              <Button className="cta-primary px-6 py-2 font-medium flex-1">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;