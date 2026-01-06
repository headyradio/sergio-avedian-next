import { ExternalLink } from "lucide-react";
import businessInsiderLogo from "@/assets/business-insider-logo.png";

const FeaturedArticleBanner = () => {
  return (
    <section className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-y border-amber-200/50">
      <a
        href="https://www.businessinsider.com/retired-wall-street-trader-drives-for-uber-lyft-2025-12"
        target="_blank"
        rel="noopener noreferrer"
        className="block py-4 px-4 md:px-8 hover:bg-amber-50/50 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 md:gap-6 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Featured
            </span>
            <img
              src={businessInsiderLogo}
              alt="Business Insider"
              className="h-5 md:h-6 object-contain"
            />
          </div>
          
          <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
            <span className="font-medium text-foreground">Sergio was recently featured on Business Insider.</span>
            {" "}Check out the article!
          </p>
          
          <div className="flex items-center gap-1 text-amber-600 font-medium text-sm shrink-0">
            Read Article
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </a>
    </section>
  );
};

export default FeaturedArticleBanner;
