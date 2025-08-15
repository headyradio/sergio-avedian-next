import { Button } from "@/components/ui/button";
import { Play, Mail } from "lucide-react";
import sergioHero from "@/assets/sergio-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-surface via-background to-surface-secondary overflow-hidden">
      <div className="editorial-container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-cta/10 text-cta border border-cta/20">
                <span className="text-sm font-medium">Latest Episode</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
                Navigating the Gig Economy Revolution
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                Expert insights on rideshare, delivery, regulation, and financial strategies 
                for gig workers. Join thousands who trust Sergio's analysis.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Latest Video
              </Button>
              <Button variant="cta" size="xl" className="group">
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Get Weekly Insights
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-8 border-t border-card-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">50K+</div>
                <div className="text-sm text-text-secondary">YouTube Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">10K+</div>
                <div className="text-sm text-text-secondary">Newsletter Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">500+</div>
                <div className="text-sm text-text-secondary">Videos Published</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-last">
            <div className="relative">
              <img
                src={sergioHero}
                alt="Sergio Avedian - Gig Economy Expert"
                className="w-full h-auto rounded-2xl shadow-large"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary hover:bg-primary-hover text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center shadow-large cursor-pointer transform hover:scale-110 transition-all duration-300 group">
                  <Play className="h-8 w-8 ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-card-border rounded-2xl p-6 shadow-large backdrop-blur-sm">
              <div className="text-sm text-text-secondary">This Week</div>
              <div className="text-2xl font-bold text-text-primary">125K</div>
              <div className="text-sm text-text-secondary">Video Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-cta/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroSection;