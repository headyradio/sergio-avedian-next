import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscribeRequest {
  email: string;
  firstName?: string;
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriber?: any;
  error?: string;
  details?: string;
}

export const useNewsletterSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscribeRequest): Promise<SubscribeResponse> => {
      console.log('Calling convertkit-subscribe edge function with:', data);
      
      const { data: response, error } = await supabase.functions.invoke(
        'convertkit-subscribe',
        {
          body: {
            email: data.email,
            firstName: data.firstName,
          },
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to subscribe');
      }

      console.log('Edge function response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Subscription successful:', data);
      
      if (data.success) {
        toast({
          title: "Successfully Subscribed!",
          description: "Welcome to our newsletter. You'll receive our latest insights and trading psychology tips.",
        });
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    },
    onError: (error: Error) => {
      console.error('Subscription error:', error);
      
      toast({
        title: "Subscription Failed", 
        description: error.message.includes('already subscribed') || error.message.includes('duplicate')
          ? "You're already subscribed to our newsletter!"
          : "We couldn't process your subscription. Please try again.",
        variant: error.message.includes('already subscribed') || error.message.includes('duplicate') ? "default" : "destructive",
      });
    },
  });

  return {
    subscribe: subscribeMutation.mutate,
    isLoading: subscribeMutation.isPending,
    error: subscribeMutation.error,
    isSuccess: subscribeMutation.isSuccess,
  };
};