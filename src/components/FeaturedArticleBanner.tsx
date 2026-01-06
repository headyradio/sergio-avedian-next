import { ExternalLink, Sparkles } from "lucide-react";
import businessInsiderLogo from "@/assets/business-insider-logo.png";

const FeaturedArticleBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-background via-primary/10 to-background border-y border-primary/30 overflow-hidden">
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
      
      <a
        href="https://www.businessinsider.com/retired-wall-street-trader-drives-for-uber-lyft-2025-12"
        target="_blank"
        rel="noopener noreferrer"
        className="relative block py-4 px-4 md:px-8 hover:bg-primary/5 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 md:gap-6 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg shadow-primary/25">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
            <img
              src={businessInsiderLogo}
              alt="Business Insider"
              className="h-5 md:h-6 object-contain brightness-0 invert opacity-80"
            />
          </div>
          
          <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
            <span className="font-medium text-foreground">Sergio was recently featured on Business Insider.</span>
            {" "}Check out the article!
          </p>
          
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm shrink-0 group-hover:underline">
            Read Article
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </a>
    </section>
  );
};

export default FeaturedArticleBanner;
