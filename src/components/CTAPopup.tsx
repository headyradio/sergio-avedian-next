import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, Mail } from "lucide-react";
import SubscribeDropdown from "./SubscribeDropdown";
import youtubeIcon from "@/assets/youtube-icon.png";

interface CTAPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CTAPopup = ({ isOpen, onClose }: CTAPopupProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleYouTubeSubscribe = () => {
    window.open("https://www.youtube.com/@SergioAvedian/", "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleEmailSubscribe = () => {
    setIsEmailModalOpen(true);
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem('ctaPopupDismissed', Date.now().toString());
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDismiss}>
        <DialogContent className="sm:max-w-md mx-4 p-0 overflow-hidden bg-card border-card-border shadow-2xl">
          <div className="relative bg-gradient-to-br from-primary/5 via-background to-brand-secondary/5 p-6">            
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-text-primary bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                Get Sergio's Latest Insights Delivered to Your Inbox
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed">
                New to investing or already an active trader, get practical, no‑hype guidance from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor. Proven long‑term strategies and compounding made simple. Trusted by 2,580+ subscribers. Join the community now.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleYouTubeSubscribe}
                  variant="outline"
                  className="flex items-center gap-2 flex-1 hover:bg-surface transition-colors"
                >
                  <img 
                    src={youtubeIcon} 
                    alt="YouTube" 
                    className="w-5 h-5 object-contain"
                  />
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
                No thanks, I'll pass
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* EmailSubscriptionModal will be handled by the existing component */}
    </>
  );
};

export default CTAPopup;