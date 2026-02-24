"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";


const FeaturedArticleBanner = () => {

  return (
    <section className="border-y border-border/50">
      <a
        href="https://www.businessinsider.com/retired-wall-street-trader-drives-for-uber-lyft-2025-12"
        target="_blank"
        rel="noopener noreferrer"
        className="block py-5 px-6 md:px-8 hover:bg-surface/50 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-5 md:gap-8 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
            <Image
              src="/business-insider-logo.png"
              alt="Business Insider"
              width={100}
              height={24}
              className="h-5 md:h-6 w-auto object-contain brightness-0 invert opacity-70"
            />
          </div>
          
          <p className="text-sm md:text-base text-text-secondary text-center md:text-left">
            <span className="font-medium text-text-primary">Sergio was recently featured on Business Insider.</span>
            {" "}Check out the article!
          </p>
          
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm shrink-0 group">
            Read Article
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </a>
    </section>
  );
};

export default FeaturedArticleBanner;
