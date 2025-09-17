import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import sergioHeroMain from "@/assets/sergio-hero-main.png";

const MainHeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-brand-secondary/5"></div>
      
      <div className="editorial-container py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-6">
              <div className="glass-card inline-flex items-center px-4 py-2 rounded-full">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary font-mono uppercase tracking-wider">Wall Street Veteran</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-text-primary leading-none">
                <span className="block">30+ Years of</span>
                <span className="block text-gradient">Trading Experience</span>
                <span className="block">on One Channel</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl prose-modern">
                With over 30 years on Wall Street, I've braved market turbulence, adapting my strategies through crises like the dot-com bubble, housing crash, COVID and today's volatility. 
                <span className="block mt-4 font-semibold text-text-primary">
                  Discipline and patience are paramount. Continuous learning is essential in an ever-changing market.
                </span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                variant="hero" 
                size="xl" 
                className="group cta-electric text-lg px-8 py-4"
              >
                Start Learning Today
                <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="xl" className="group glass-card text-lg px-8 py-4">
                View Track Record
              </Button>
            </div>

            {/* Credentials */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">30+</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">5</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Market Crises</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">1M+</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Lives Impacted</div>
              </div>
            </div>
          </div>

          {/* Sergio's Image */}
          <div className="relative lg:order-last">
            <div className="relative">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-brand-secondary/10 p-1">
                <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-sm">
                  <img
                    src={sergioHeroMain}
                    alt="Sergio Avedian - 30+ Years Wall Street Trading Expert"
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Floating achievement card */}
              <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-6 shadow-large max-w-64">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brand-secondary flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Wall Street Veteran</div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Since 1990s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-radial from-brand-secondary/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-brand-accent/5 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </section>
  );
};

export default MainHeroSection;