"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useNewsletterSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subscribe = async (email: string, firstName?: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name: firstName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast({
        title: "Successfully subscribed!",
        description: "You're now on the list for exclusive insights.",
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again";
      
      toast({
        title: "Subscription failed",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribe, isLoading };
}