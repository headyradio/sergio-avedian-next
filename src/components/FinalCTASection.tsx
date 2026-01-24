"use client";

import { useState } from "react";
import { Youtube, Mail, ArrowRight, Bell, CheckCircle } from "lucide-react";

export default function FinalCTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface-secondary" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Don't Miss Out on Financial Insights
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Join thousands who get practical wealth-building strategies delivered straight to their inbox—no hype, just results.
            </p>
          </div>

          {/* Two-column CTA */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Newsletter Signup */}
            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Newsletter</h3>
              </div>
              
              <p className="text-text-secondary text-sm mb-5">
                Weekly insights on investing, markets, and building long-term wealth.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-background/60 border border-border/50 rounded-lg text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Subscribed!
                    </>
                  ) : isSubmitting ? (
                    <span className="animate-pulse">Subscribing...</span>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* YouTube Subscribe */}
            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">YouTube</h3>
              </div>
              
              <p className="text-text-secondary text-sm mb-5">
                Live trading sessions, market analysis, and educational content every week.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>10K+ subscribers already watching</span>
                </div>
                <a
                  href="https://www.youtube.com/@SergioAvedian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Youtube className="w-5 h-5" />
                  Subscribe on YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Trust indicator */}
          <p className="text-center text-text-muted text-sm mt-8">
            No spam, unsubscribe anytime. Your privacy is respected.
          </p>
        </div>
      </div>
    </section>
  );
}
