"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";

const MainHeroSection = () => {
  return (
    <section className="relative min-h-[75vh] flex items-center bg-background overflow-hidden">
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: 'var(--gradient-mesh)' }}
      />

      <div className="editorial-container relative z-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface border border-border">
              <span className="text-sm font-medium text-text-secondary">
                35+ Years Wall Street Experience
              </span>
            </div>

            {/* Headline - Slide deck style: Large, bold, clean */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Build Wealth
              <span className="block text-primary mt-2">Without a Financial Advisor</span>
            </h1>

            {/* Subheadline with divider like slide deck */}
            <div className="border-l-4 border-primary pl-6">
              <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                Practical, no-hype guidance from Sergio Avedian — 35+ years on Wall Street. 
                Master proven strategies for long-term wealth building.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SubscribeDropdown variant="cta" size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-4 rounded-lg shadow-glow" />
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group border-2 border-text-secondary/30 hover:border-primary text-text-primary hover:text-primary">
                  Start Coaching
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="flex items-center gap-8 pt-6">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-text-muted uppercase tracking-wider">Subscribers</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-text-muted uppercase tracking-wider">Videos</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">35+</div>
                <div className="text-sm text-text-muted uppercase tracking-wider">Years</div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Subtle shadow behind image */}
              <div className="absolute -inset-4 bg-primary/10 rounded-lg blur-2xl" />
              <Image
                src="/sergio-hero-main.png"
                alt="Sergio Avedian - Wall Street Veteran"
                width={520}
                height={620}
                className="relative rounded-lg shadow-elegant"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;