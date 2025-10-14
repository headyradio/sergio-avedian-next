import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Phone, FileText, TrendingUp, Shield } from "lucide-react";
import ContactFormModal from "@/components/ContactFormModal";

const PersonalCoachingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Personal Strategy Development",
      description: "Custom investment strategies tailored to your goals and risk tolerance"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Portfolio Review & Analysis",
      description: "Deep dive analysis of your current holdings with optimization recommendations"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Direct Phone Access",
      description: "Unlimited phone and email support during market hours"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Custom Market Analysis",
      description: "Personalized market insights and trade recommendations based on current conditions"
    }
  ];


  return (
    <section className="py-20 bg-gradient-to-br from-surface/30 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="editorial-container relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">1-on-1 Support</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            One-on-One
            <span className="text-gradient block">Personalized Coaching</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Get direct access to Sergio's 35+ years of Wall Street expertise. 
            Receive personalized advice, custom strategies, and ongoing support tailored to your unique goals and interests in investing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-premium text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Personal Coaching */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Why Work With Sergio One-on-One?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-left">
              <h4 className="text-lg font-semibold text-foreground mb-3">Proven Track Record</h4>
              <p className="text-text-secondary">
                35+ years navigating Wall Street's ups and downs. Learn from someone who's actually been through multiple market cycles and economic downturns.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-foreground mb-3">Personalized Approach</h4>
              <p className="text-text-secondary">
                No cookie-cutter strategies. Every coaching session is tailored to your specific goals, risk tolerance, and current market conditions.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-foreground mb-3">Real-World Experience</h4>
              <p className="text-text-secondary">
                Learn practical strategies that actually work in today's markets, not just theoretical concepts from textbooks.
              </p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-foreground mb-3">Ongoing Support</h4>
              <p className="text-text-secondary">
                Get the guidance and accountability you need to stay disciplined and make consistent progress toward your financial goals.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-16">
          <Card className="card-premium max-w-3xl mx-auto">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Ready to Take Your Trading to the Next Level?
              </h3>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                Let's have a no-pressure conversation about your trading goals and challenges. 
                Reach out to get personalized insights and see if working together makes sense.
              </p>
              
              <div className="space-y-3 sm:space-y-4 mb-8">
                <div className="flex items-center justify-center sm:justify-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-text-secondary">No sales pitch - just valuable insights</span>
                </div>
                <div className="flex items-center justify-center sm:justify-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-text-secondary">Personalized advice for your situation</span>
                </div>
                <div className="flex items-center justify-center sm:justify-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-text-secondary">Zero commitment required</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-h-[48px] cta-electric text-base sm:text-lg px-6 sm:px-10 py-4"
                onClick={() => setIsModalOpen(true)}
              >
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Contact Me to Learn More</span>
              </Button>
              
              <p className="text-sm text-text-muted mt-4">
                Typically responds within 24-48 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ContactFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        defaultSubject="Coaching Inquiry"
      />
    </section>
  );
};

export default PersonalCoachingSection;