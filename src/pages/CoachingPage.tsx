import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Phone } from "lucide-react";
import PersonalCoachingSection from "@/components/PersonalCoachingSection";

const CoachingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>
        
        <div className="editorial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Wall Street Veteran • Proven Track Record</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Get Personalized Trading Guidance from a
              <span className="text-gradient block mt-2">35-Year Wall Street Veteran</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Work directly with Sergio to develop custom strategies, master risk management, 
              and build the mental discipline needed for consistent trading success.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">35+</div>
                <div className="text-sm text-text-secondary">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-text-secondary">Traders Mentored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Multiple</div>
                <div className="text-sm text-text-secondary">Market Cycles</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button size="lg" className="cta-electric text-lg px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Coaching Section */}
      <PersonalCoachingSection />

      <Footer />
    </div>
  );
};

export default CoachingPage;