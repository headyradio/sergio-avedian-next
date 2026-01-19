"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Phone } from "lucide-react";
import ContactFormModal from "@/components/ContactFormModal";

export default function CoachingHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-h-[48px] cta-electric text-base sm:text-lg px-6 sm:px-8 py-4"
                onClick={() => setIsModalOpen(true)}
              >
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Contact Me to Learn More</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ContactFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        defaultSubject="Coaching Inquiry"
      />
    </>
  );
}
