"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CheckCircle2, Mail } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const NewsletterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { subscribe, isLoading } = useNewsletterSubscription();

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

    const result = await subscribe(email.trim(), `${firstName.trim()} ${lastName.trim()}`);
    
    if (result.success) {
      setIsSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setConsent(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-text-primary">You&apos;re All Set!</h2>
          <p className="text-lg text-text-secondary">
            Check your email to confirm your subscription
          </p>
          <p className="text-sm text-text-muted">
            You&apos;ll start receiving Sergio&apos;s insights and strategies in your inbox soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-text-primary">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 bg-surface border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-text-primary">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 bg-surface border-border"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-surface border-border"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            disabled={isLoading}
            className="mt-1"
          />
          <Label htmlFor="consent" className="text-sm leading-6 text-text-secondary cursor-pointer">
            I agree and give consent to receive communication from Sergio Avedian and any affiliated partners.
          </Label>
        </div>
        
        <div className="space-y-4">
          <Button 
            type="submit" 
            variant="cta" 
            size="lg"
            disabled={isLoading || !consent}
            className="w-full h-14 text-lg"
          >
            {isLoading ? (
              <>
                <Mail className="mr-2 h-5 w-5 animate-pulse" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                Subscribe Now
              </>
            )}
          </Button>
          
          <div className="space-y-3 text-center">
            <p className="text-xs text-text-muted">
              By subscribing, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:text-primary-hover underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms-of-service" className="text-primary hover:text-primary-hover underline">
                Terms of Service
              </a>.
              <br />
              You can unsubscribe at any time.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs h-auto p-0 text-text-muted hover:text-text-secondary underline">
                  View Investment Disclaimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Investment Disclaimer</AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    DISCLAIMER: Investments or strategies mentioned may not be suitable for you and you should make your own independent decisions. You should strongly consider seeking advice from an investment advisor. Past performance is not indicative of future results. Neither the channel participants nor Sergio Avedian guarantee any specific outcome or profit!
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
    </div>
  );
};

export default NewsletterForm;
