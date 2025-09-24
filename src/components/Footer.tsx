import { Button } from "@/components/ui/button";
import { Youtube, X, Linkedin, Mail } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import sergioAvedianLogo from "@/assets/sergio-avedian-logo-2.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmailSubscriptionModal from "@/components/EmailSubscriptionModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const footerSections = [
    {
      title: "Resources",
      links: [
        { label: "Latest Videos", href: "/#videos", type: "anchor" },
        { label: "Blog Articles", href: "/blog", type: "internal" },
        { label: "Trading Education", href: "/coaching", type: "internal" },
        { label: "About Sergio", href: "/about", type: "internal" },
        { label: "Investment Strategies", href: "/blog?category=investment", type: "internal" },
        { label: "Options Trading", href: "/blog?category=trading", type: "internal" },
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Newsletter", href: "#newsletter", type: "modal" },
        { label: "Contact", href: "/contact", type: "internal" },
        { label: "Personal Coaching", href: "/coaching", type: "internal" },
        { label: "YouTube Channel", href: "https://www.youtube.com/@SergioAvedian/", type: "external" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/sergio-avedian-9939291/", type: "external" },
      ]
    }
  ];

  const handleLinkClick = (link: any, e: React.MouseEvent) => {
    if (link.type === "modal") {
      e.preventDefault();
      setIsNewsletterModalOpen(true);
    } else if (link.type === "anchor") {
      e.preventDefault();
      const elementId = link.href.substring(2); // Remove /#
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-surface border-t border-card-border">
      <div className="editorial-container py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src={sergioAvedianLogo} 
                alt="Sergio Avedian" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.
            </p>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                onClick={() => window.open("https://www.youtube.com/@SergioAvedian/", "_blank", "noopener noreferrer")}
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                onClick={() => window.open("https://x.com/sergioaved", "_blank", "noopener noreferrer")}
              >
                <X className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                onClick={() => window.open("https://www.linkedin.com/in/sergio-avedian-9939291/", "_blank", "noopener noreferrer")}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Link to="/contact">
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                  <Mail className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.type === "internal" ? (
                      <Link
                        to={link.href}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    ) : link.type === "external" ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(link, e)}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom Copyright Section */}
        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <span>© 2025 Sergio Avedian. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <EmailSubscriptionModal 
        open={isNewsletterModalOpen} 
        onOpenChange={setIsNewsletterModalOpen} 
      />
    </footer>
  );
};

export default Footer;