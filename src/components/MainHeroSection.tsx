import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import sergioHeroMain from "@/assets/sergio-hero-main.png";
import { useHomepageContent } from "@/hooks/useSupabaseCMS";

const MainHeroSection = () => {
  const { data: content, isLoading } = useHomepageContent();

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

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center section-animate">
      {/* Enhanced Background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-brand-secondary/5"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="editorial-container py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 lg:space-y-12 animate-fade-in">
            <div className="space-y-6">
              <div className="glass-card inline-flex items-center px-4 py-2 rounded-full hover:scale-105 transition-all duration-300">
                <TrendingUp className="h-4 w-4 mr-2 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary font-mono uppercase tracking-wider">Wall Street Veteran</span>
              </div>
              
              {/* Sergio's Motto */}
              <div className="glass-card inline-flex items-center px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 glow-primary">
                <span className="text-lg font-bold text-gradient font-mono tracking-wider">
                  {content?.main_hero_motto || "Patience. Position. Planning."}
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-foreground leading-none animate-fade-in" style={{ animationDelay: '200ms' }}>
                <span className="block hover:text-gradient transition-all duration-500">{content?.main_hero_title || "30+ Years of"}</span>
                <span className="block text-gradient">{content?.main_hero_subtitle || "Trading Experience"}</span>
                <span className="block hover:text-gradient transition-all duration-500">on One Channel</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-secondary leading-relaxed max-w-2xl prose-modern animate-fade-in" style={{ animationDelay: '400ms' }}>
                {content?.main_hero_description || "With over 30 years on Wall Street, I've braved market turbulence, adapting my strategies through crises like the dot-com bubble, housing crash, COVID and today's volatility. Discipline and patience are paramount. Continuous learning is essential in an ever-changing market."}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <Button 
                variant="hero" 
                size="xl" 
                className="group cta-electric text-lg px-8 py-4 hover:shadow-glow transition-all duration-300"
              >
                {content?.main_hero_cta_primary || "Start Learning Today"}
                <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="xl" className="group glass-card text-lg px-8 py-4 hover:glow-primary transition-all duration-300">
                {content?.main_hero_cta_secondary || "View Track Record"}
              </Button>
            </div>

            {/* Credentials */}
            <div className="flex items-center space-x-8 pt-8 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-black text-gradient group-hover:scale-110 transition-transform duration-300">{content?.main_hero_years_experience || "30+"}</div>
                <div className="text-sm text-muted font-mono uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-black text-gradient group-hover:scale-110 transition-transform duration-300">{content?.main_hero_market_crises || "5"}</div>
                <div className="text-sm text-muted font-mono uppercase tracking-wider">Market Crises</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-black text-gradient group-hover:scale-110 transition-transform duration-300">{content?.main_hero_lives_impacted || "1M+"}</div>
                <div className="text-sm text-muted font-mono uppercase tracking-wider">Lives Impacted</div>
              </div>
            </div>
          </div>

          {/* Sergio's Image */}
          <div className="relative lg:order-last animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="relative float-animation">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-brand-secondary/10 p-1 hover:from-primary/20 hover:to-brand-secondary/20 transition-all duration-500">
                <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-sm">
                  <img
                    src={sergioHeroMain}
                    alt="Sergio Avedian - 30+ Years Wall Street Trading Expert"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Enhanced overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Enhanced floating achievement card */}
              <div className="absolute -bottom-6 -left-6 card-premium rounded-2xl p-6 shadow-large max-w-64 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brand-secondary flex items-center justify-center shadow-glow">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Wall Street Veteran</div>
                    <div className="text-xs text-muted font-mono uppercase tracking-wider">Since 1990s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Ambient Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ 
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '0s' 
        }}></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-radial from-brand-secondary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-brand-accent/8 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '1s'
        }}></div>
        
        {/* Additional floating elements for depth */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-gradient-radial from-brand-accent/5 to-transparent rounded-full blur-2xl" style={{
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '3s'
        }}></div>
      </div>
    </section>
  );
};

export default MainHeroSection;