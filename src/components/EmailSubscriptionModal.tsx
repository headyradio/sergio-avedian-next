import { useState } from "react";
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
import { Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailSubscriptionModal = ({ open, onOpenChange }: EmailSubscriptionModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully Subscribed!",
        description: "Welcome to our newsletter. Check your email for confirmation.",
      });
      setEmail("");
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

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