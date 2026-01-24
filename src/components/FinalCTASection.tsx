"use client";

import SubscribeDropdown from "./SubscribeDropdown";

export default function FinalCTASection() {
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
        <div className="max-w-2xl mx-auto text-center">
          {/* Main content */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Don't Miss Out on Financial Insights
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
            Join thousands who get practical wealth-building strategies delivered straight to their inbox—no hype, just results.
          </p>

          {/* Consolidated Subscribe Button */}
          <div className="flex justify-center">
            <SubscribeDropdown 
              variant="cta" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold" 
            />
          </div>

          {/* Trust indicator */}
          <p className="text-text-muted text-sm mt-6">
            No spam, unsubscribe anytime. Your privacy is respected.
          </p>
        </div>
      </div>
    </section>
  );
}
