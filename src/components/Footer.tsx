"use client";

import { Button } from "@/components/ui/button";
import { Youtube, Linkedin, Mail } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import EmailSubscriptionModal from "@/components/EmailSubscriptionModal";

const Footer = () => {
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const footerSections = [
    {
      title: "Resources",
      links: [
        { label: "Latest Videos", href: "/#videos", type: "anchor" },
        { label: "Blog Articles", href: "/blog", type: "internal" },
        { label: "Trading Education", href: "/coaching", type: "internal" },
        { label: "About Sergio", href: "/about-sergio", type: "internal" },
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
        { label: "X.com", href: "https://x.com/sergioaved", type: "external" },
      ]
    }
  ];

  const handleLinkClick = (link: { type: string; href: string }, e: React.MouseEvent) => {
    if (link.type === "modal") {
      e.preventDefault();
      setIsNewsletterModalOpen(true);
    } else if (link.type === "anchor") {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        const elementId = link.href.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.location.href = link.href;
      }
    }
  };

  return (
    <footer className="bg-surface border-t border-card-border">
      <div className="editorial-container py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image 
                src="/sergio-avedian-logo.png"
                alt="Sergio Avedian" 
                width={150}
                height={48}
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
                onClick={() => window.open("https://x.com/sergioaved", "_blank", "noopener noreferrer")}
                aria-label="Visit Sergio Avedian on X.com"
              >
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                onClick={() => window.open("https://www.youtube.com/@SergioAvedian/", "_blank", "noopener noreferrer")}
                aria-label="Visit Sergio Avedian on YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                onClick={() => window.open("https://www.linkedin.com/in/sergio-avedian-9939291/", "_blank", "noopener noreferrer")}
                aria-label="Visit Sergio Avedian on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-muted hover:text-primary"
                asChild
              >
                <Link href="/contact" aria-label="Contact Sergio Avedian">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.type === "internal" ? (
                      <Link
                        href={link.href}
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

        {/* Investment Disclaimer */}
        <div className="mt-12 p-4 bg-surface-secondary/50 rounded-lg border border-border/30">
          <p className="text-xs text-text-secondary/80 leading-relaxed text-center">
            <strong className="text-text-secondary">DISCLAIMER:</strong> Investments or strategies mentioned on this channel may not be suitable for you and you should make your own independent decisions. You should strongly consider seeking advice from an investment advisor. Past performance is not indicative of future results.
          </p>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary/80">
            <div className="flex items-center gap-1">
              <span>© 2025 Sergio Avedian. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="hover:text-primary transition-colors">
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