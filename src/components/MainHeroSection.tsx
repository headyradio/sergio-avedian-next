"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";

const MainHeroSection = () => {
  return (
    <section className="relative px-4 md:px-6 lg:px-8 pt-4 pb-0">
      {/* Full-width rounded image container */}
      <div className="relative w-full min-h-[85vh] md:min-h-[88vh] lg:min-h-[90vh] rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Background Image — positioned so Sergio's face is in the upper third */}
        <Image
          src="/sergio-sf.png"
          alt="Sergio Avedian with Golden Gate Bridge, San Francisco"
          fill
          className="object-cover object-[center_25%]"
          priority
          sizes="100vw"
        />

        {/* Bottom-heavy gradient — clear at top, strong at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-30% to-transparent to-60%" />

        {/* Content — anchored to center-bottom */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 sm:px-8 md:px-10 pb-8 md:pb-12 lg:pb-14">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] 2xl:text-[4rem] font-display leading-[1.1] md:leading-[1.08] tracking-wide text-white drop-shadow-lg w-full max-w-lg md:max-w-none text-center whitespace-normal md:whitespace-nowrap text-balance md:text-auto mb-2 lg:mb-3">
            Build Wealth Without a{" "}
            <span className="block md:inline lg:mt-0 mt-1 md:text-primary text-primary">Financial Advisor</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium tracking-wide drop-shadow-md max-w-2xl">
            Master proven strategies for long-term wealth building
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
            <SubscribeDropdown
              variant="cta"
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 rounded-lg text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
            />
            <Link href="/coaching">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto group bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-8 py-3 rounded-lg text-sm"
              >
                Get Coaching
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;