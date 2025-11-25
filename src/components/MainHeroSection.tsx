import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import sergioHeroMain from "@/assets/sergio-hero-main.png";
import forbesLogo from "@/assets/forbes-logo.png";
import businessInsiderLogo from "@/assets/business-insider-logo.png";
import nytLogo from "@/assets/nyt-logo.png";
import wsjLogo from "@/assets/wsj-logo.png";
import bloombergLogo from "@/assets/bloomberg-logo.png";
import { useHomepageContent } from "@/hooks/useSupabaseCMS";
import SubscribeDropdown from "@/components/SubscribeDropdown";

const MainHeroSection = () => {
  const { data: content, isLoading } = useHomepageContent();
  
  console.log('MainHeroSection - isLoading:', isLoading);
  console.log('MainHeroSection - content:', content);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        <div className="editorial-container py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-8 lg:space-y-12">
              <div className="loading-shimmer h-8 w-64 rounded"></div>
              <div className="loading-shimmer h-32 w-full rounded"></div>
              <div className="loading-shimmer h-12 w-48 rounded"></div>
            </div>
            <div className="loading-shimmer h-96 w-full rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

  const heroContent = {
    main_hero_title: content?.main_hero_title || "Wall Street Veteran with 35+ Years Experience",
    main_hero_subtitle: content?.main_hero_subtitle || "Teaching Disciplined Trading & Investment Strategies",
    main_hero_description: content?.main_hero_description || "Learn from a seasoned Wall Street professional who has navigated multiple market cycles. Master the psychology of trading, risk management, and proven strategies for long-term wealth building through disciplined investing.",
    main_hero_motto: content?.main_hero_motto || "Knowledge. Discipline. Patience.",
    main_hero_cta_primary: content?.main_hero_cta_primary || "Join My Community",
    main_hero_cta_secondary: content?.main_hero_cta_secondary || "Watch Free Training",
    main_hero_experience_years: (content as any)?.main_hero_experience_years || "35+",
    main_hero_experience_label: (content as any)?.main_hero_experience_label || "Years on Wall Street"
  };
  
  return (
    <section className="relative bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Ambient Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="editorial-container py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="space-y-8 lg:space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Wall Street Veteran • 35+ Years Experience</span>
            </div>
            
            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {heroContent.main_hero_title}
              </h1>
              
              <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
                {heroContent.main_hero_subtitle}
              </h2>
              
              {/* Motto */}
              <div className="py-4">
                <p className="text-lg md:text-xl font-semibold text-primary italic">
                  "{heroContent.main_hero_motto}"
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {heroContent.main_hero_description}
              </p>
            </div>
            
            {/* Subscribe CTA */}
            <div className="flex justify-start">
              <SubscribeDropdown 
                variant="cta" 
                size="lg" 
                className="text-lg px-8 py-4 font-semibold"
              />
            </div>
          </div>
          
          {/* Image Column */}
          <div className="relative">
            <div className="relative z-10">
              {/* LCP Image - Optimized with priority loading */}
              <picture>
                <source
                  type="image/avif"
                  srcSet={sergioHeroMain.replace('.png', '.avif')}
                />
                <source
                  type="image/webp"
                  srcSet={sergioHeroMain.replace('.png', '.webp')}
                />
                <img
                  src={sergioHeroMain}
                  alt="Sergio Avedian - Wall Street Veteran & Trading Mentor"
                  width={800}
                  height={1000}
                  className="w-full h-auto rounded-3xl shadow-2xl"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />
              </picture>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-lg font-medium text-foreground">Sergio Avedian</p>
                    <p className="text-xs text-muted-foreground">Wall Street Veteran and Content Creator</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-6 scale-105 -z-10"></div>
          </div>
        </div>
        
        {/* Media Placements Section */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              As Featured In
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto">
            {/* The New York Times */}
            <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
              <a
                href="https://www.nytimes.com/2025/05/14/technology/lax-uber-driver-wages.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={nytLogo}
                  alt="The New York Times"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain filter grayscale"
                  loading="lazy"
                />
              </a>
            </div>
            
            {/* Bloomberg */}
            <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
              <a
                href="https://www.bloomberg.com/news/features/2022-05-27/how-uber-and-lyft-gamify-the-gig-economy"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={bloombergLogo}
                  alt="Bloomberg"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain filter grayscale"
                  loading="lazy"
                />
              </a>
            </div>
            
            {/* The Wall Street Journal */}
            <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
              <a
                href="https://www.wsj.com/articles/uber-ceo-started-driving-for-uber-5bef5023?gaa_at=eafs&gaa_n=ASWzDAjnUf2iP5n63TrLVlECCxDVZjkCIj46eKvyiYnQmqDQEsWDZr_DJ8xlar9jbRg%3D&gaa_ts=68d069ec&gaa_sig=zU3Sj32WpHntCD1LjuQkKWw-2HlUu5WOJ6-ZRALRS4mTaypIrCK6OC7Ep23NK0-x6Wq8AESivXUG_zMospqRCg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={wsjLogo}
                  alt="The Wall Street Journal"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain filter grayscale"
                  loading="lazy"
                />
              </a>
            </div>
            
            {/* Forbes */}
            <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
              <a
                href="https://www.forbes.com/sites/lensherman/2024/01/16/will-2024-be-a-year-of-reckoning-for-ubers-driver-relations/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={forbesLogo}
                  alt="Forbes"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain filter grayscale"
                  loading="lazy"
                />
              </a>
            </div>
            
            {/* Business Insider */}
            <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
              <a
                href="https://www.businessinsider.com/uber-cracks-down-on-driver-gps-locations-deactivating-accounts-2025-9?utm_source=flipboard&utm_content=topic%2Fubereats"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={businessInsiderLogo}
                  alt="Business Insider"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain filter grayscale"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Connector */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background/50 pointer-events-none"></div>
    </section>
  );
};

export default MainHeroSection;