"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Award } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";

const MainHeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>

      <div className="editorial-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                35+ Years Wall Street Experience
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-text-primary">
              Build Wealth
              <span className="text-gradient block">Without a Financial Advisor</span>
            </h1>

            <p className="text-xl text-text-secondary max-w-xl leading-relaxed">
              Practical, no-hype guidance from Sergio Avedian — 35+ years on Wall Street. 
              Master proven strategies for long-term wealth building and financial independence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <SubscribeDropdown variant="cta" size="lg" className="cta-electric" />
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                  Start Coaching
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">Subscribers</div>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">Videos</div>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">35+</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">Years</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-brand-secondary/20 rounded-2xl transform rotate-6 blur-xl"></div>
              <Image
                src="/sergio-hero-main.png"
                alt="Sergio Avedian - Wall Street Veteran"
                width={500}
                height={600}
                className="relative rounded-2xl shadow-large"
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