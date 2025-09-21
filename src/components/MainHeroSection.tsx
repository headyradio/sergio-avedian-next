import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import sergioHeroMain from "@/assets/sergio-hero-main.png";
import { useHomepageContent } from "@/hooks/useSupabaseCMS";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import StockMarketWidget from "@/components/StockMarketWidget";

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
    main_hero_title: content?.main_hero_title || "Master Your Trading Psychology",
    main_hero_subtitle: content?.main_hero_subtitle || "From Emotional Trading to Systematic Success",
    main_hero_description: content?.main_hero_description || "Transform your trading mindset with proven psychological strategies. Learn to control emotions, build discipline, and achieve consistent results in the markets.",
    main_hero_motto: content?.main_hero_motto || "Patience. Position. Planning.",
    main_hero_cta_primary: content?.main_hero_cta_primary || "Start Your Journey",
    main_hero_cta_secondary: content?.main_hero_cta_secondary || "Watch Free Training",
    main_hero_experience_years: (content as any)?.main_hero_experience_years || "15+",
    main_hero_experience_label: (content as any)?.main_hero_experience_label || "Years Trading"
  };
  
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Ambient Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="editorial-container py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="space-y-8 lg:space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Trading Psychology Expert</span>
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
              <img
                src={sergioHeroMain}
                alt="Sergio Avedian - Trading Psychology Expert"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              
              {/* Floating Market Data Badge */}
              <div className="absolute -bottom-6 -left-6 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-lg">
                <StockMarketWidget variant="compact" />
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-6 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;