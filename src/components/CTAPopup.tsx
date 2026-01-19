"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mail, Youtube } from "lucide-react";

interface CTAPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CTAPopup = ({ isOpen, onClose }: CTAPopupProps) => {
  const handleYouTubeSubscribe = () => {
    window.open("https://www.youtube.com/@SergioAvedian/", "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleEmailSubscribe = () => {
    // Navigate to newsletter page instead of opening modal
    window.location.href = "/newsletter";
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem('ctaPopupDismissed', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-md mx-4 p-0 overflow-hidden bg-card border-card-border shadow-2xl">
        <div className="relative bg-gradient-to-br from-primary/5 via-background to-brand-secondary/5 p-6">            
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-text-primary bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
              Get Sergio&apos;s Latest Insights Delivered to Your Inbox
            </h3>
            
            <p className="text-sm text-text-secondary leading-relaxed">
              New to investing or already an active trader, get practical, no‑hype guidance from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleYouTubeSubscribe}
                variant="outline"
                className="flex items-center gap-2 flex-1 hover:bg-surface transition-colors"
              >
                <Youtube className="w-5 h-5 text-red-600" />
                Subscribe on YouTube
              </Button>
              
              <Button
                onClick={handleEmailSubscribe}
                variant="cta"
                className="flex items-center gap-2 flex-1"
              >
                <Mail className="h-4 w-4" />
                Get Email Updates
              </Button>
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-xs text-text-secondary/80 hover:text-text-secondary transition-colors underline"
            >
              No thanks, I&apos;ll pass
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CTAPopup;