import { Button } from "@/components/ui/button";
import { Youtube, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Content",
      links: [
        { label: "Latest Videos", href: "#videos" },
        { label: "Blog Articles", href: "#blog" },
        { label: "Gig Economy", href: "#category/gig-economy" },
        { label: "Rideshare", href: "#category/rideshare" },
        { label: "Delivery", href: "#category/delivery" },
      ]
    },
    {
      title: "Topics",
      links: [
        { label: "Regulation", href: "#category/regulation" },
        { label: "Markets & Finance", href: "#category/finance" },
        { label: "Tax Tips", href: "#tax-tips" },
        { label: "Earnings Guide", href: "#earnings" },
        { label: "Industry News", href: "#news" },
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Newsletter", href: "#newsletter" },
        { label: "About Sergio", href: "#about" },
        { label: "Media Kit", href: "#media" },
        { label: "Contact", href: "#contact" },
        { label: "Speaking", href: "#speaking" },
      ]
    }
  ];

  return (
    <footer className="bg-surface border-t border-card-border">
      <div className="editorial-container py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Sergio Avedian
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Your trusted source for gig economy insights, market analysis, and financial strategies. Helping drivers and gig workers maximize their earnings.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                <Mail className="h-5 w-5" />
              </Button>
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
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-cta/10 to-primary/10 border border-cta/20 rounded-2xl p-8 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-text-primary mb-4">
              Stay Ahead of the Curve
            </h4>
            <p className="text-lg text-text-secondary mb-6">
              Join 10,000+ gig workers getting weekly insights, earnings tips, and market updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-card-border rounded-lg bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button variant="cta" size="lg">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-text-muted mt-3">
              No spam. Unsubscribe anytime. Privacy policy applies.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-8 border-t border-card-border">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-text-muted">
              © {currentYear} Sergio Avedian. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#privacy"
                className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="text-text-muted text-sm">
            Built with passion for the gig economy community
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;