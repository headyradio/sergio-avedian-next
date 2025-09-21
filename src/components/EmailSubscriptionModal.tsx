import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

interface EmailSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailSubscriptionModal = ({ open, onOpenChange }: EmailSubscriptionModalProps) => {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    // Call the subscription function
    subscribe({ email: email.trim() });
  };

  // Reset form and close modal on successful subscription
  useEffect(() => {
    if (isSuccess) {
      setEmail("");
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Subscribe to Newsletter
          </DialogTitle>
          <DialogDescription>
            Get the latest insights and updates delivered to your inbox weekly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              variant="cta" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Subscribing..." : "Subscribe Now"}
            </Button>
            
            <p className="text-xs text-text-secondary">
              By subscribing, you agree to our privacy policy and terms of service. 
              You can unsubscribe at any time.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSubscriptionModal;