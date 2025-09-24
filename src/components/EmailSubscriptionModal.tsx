import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

interface EmailSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailSubscriptionModal = ({ open, onOpenChange }: EmailSubscriptionModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    if (!consent) {
      return;
    }

    // Call the subscription function
    subscribe({ 
      email: email.trim(), 
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
  };

  // Reset form and close modal on successful subscription
  useEffect(() => {
    if (isSuccess) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setConsent(false);
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Get Sergio's Latest Insights Delivered to Your Inbox
          </DialogTitle>
          <DialogDescription>
            New to investing or already an active trader, get practical, no‑hype guidance from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor. Proven long‑term strategies and compounding made simple. Trusted by 2,580+ subscribers. Join the community now.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              disabled={isLoading}
              required
            />
            <Label htmlFor="consent" className="text-sm leading-5">
              I agree and give consent to receive communication from Sergio Avedian and any affiliated partners.
            </Label>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              variant="cta" 
              disabled={isLoading || !consent}
              className="w-full"
            >
              {isLoading ? "Subscribing..." : "Subscribe Now"}
            </Button>
            
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                By subscribing, you agree to our privacy policy and terms of service. 
                You can unsubscribe at any time.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs h-auto p-0 text-text-secondary hover:text-foreground underline">
                    View Disclaimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Investment Disclaimer</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      DISCLAIMER: Investments or strategies mentioned on this channel may not be suitable for you and you should make your own independent decisions. You should strongly consider seeking advice from an investment advisor. Past performance is not indicative of future results. Neither the channel participants nor Sergio Avedian guarantee any specific outcome or profit! You should be aware of the real risk of loss in following any strategy or investment discussed on this channel! Strategies or investments discussed may fluctuate in price or value!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>I Understand</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSubscriptionModal;