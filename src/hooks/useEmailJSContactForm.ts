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

// EmailJS configuration with provided credentials
const EMAILJS_CONFIG: EmailJSConfig = {
  serviceId: 'service_ikep40a',
  templateId: 'template_laz0oeo', 
  publicKey: 'GyG5-H2MORCvnt97Z',
};

export const useEmailJSContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContact = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting contact form via EmailJS:', data);

      // Check if EmailJS is configured (should now be ready)
      console.log('Using EmailJS configuration:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKeyLength: EMAILJS_CONFIG.publicKey.length
      });

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