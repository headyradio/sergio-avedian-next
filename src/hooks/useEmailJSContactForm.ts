import { useState } from "react";
import emailjs from '@emailjs/browser';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// These will be provided by the user after EmailJS setup
const EMAILJS_CONFIG: EmailJSConfig = {
  serviceId: 'YOUR_SERVICE_ID', // User will provide this
  templateId: 'YOUR_TEMPLATE_ID', // User will provide this
  publicKey: 'YOUR_PUBLIC_KEY', // User will provide this
};

export const useEmailJSContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContact = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting contact form via EmailJS:', data);

      // Check if EmailJS is configured
      if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
        throw new Error('EmailJS not configured yet. Please provide your EmailJS credentials.');
      }

      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Not provided',
        subject: data.subject,
        message: data.message,
        to_email: 'johanmore@gmail.com', // Primary recipient
        reply_to: data.email,
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('EmailJS submission successful:', result);
      return { success: true, message: 'Message sent successfully!' };
    } catch (error) {
      console.error('Error in useEmailJSContactForm:', error);
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