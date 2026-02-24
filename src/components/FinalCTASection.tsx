"use client";

import SubscribeDropdown from "./SubscribeDropdown";

export default function FinalCTASection() {

  return (
    <section className="section-spacing relative overflow-hidden section-cream">
      <div className="editorial-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase block mb-6">
            Stay Informed
          </span>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary mb-6 leading-tight">
            Don't Miss Out on Financial Insights
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands who get practical wealth-building strategies delivered straight to their inbox — no hype, just results.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <SubscribeDropdown 
              variant="cta" 
              size="lg" 
              className="px-10 py-4 text-lg font-semibold" 
            />
          </div>

          {/* Trust indicator */}
          <p className="text-text-muted text-sm mt-8">
            No spam, unsubscribe anytime. Your privacy is respected.
          </p>
        </div>
      </div>
    </section>
  );
}
