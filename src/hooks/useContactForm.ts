import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContact = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting contact form:', data);
      
      // Call the Supabase edge function
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        },
      });

      if (error) {
        console.error('Contact form submission error:', error);
        throw new Error(error.message || 'Failed to send message');
      }

      console.log('Contact form submission successful:', result);
      return result;
    } catch (error) {
      console.error('Error in useContactForm:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContact,
    isSubmitting,
  };
};