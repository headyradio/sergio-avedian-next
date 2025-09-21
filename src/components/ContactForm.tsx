import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject must be less than 200 characters"),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().optional(), // Anti-spam field
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const { submitContact, isSubmitting } = useContactForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      honeypot: "", // Hidden anti-spam field
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Anti-spam check
    if (data.honeypot) {
      console.log("Spam detected");
      return;
    }

    try {
      // Create properly typed submission data
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      };
      await submitContact(submissionData);
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. Sergio will get back to you soon.",
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <Card className="glass-card border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Message Sent Successfully!</h3>
            <p className="text-text-secondary mb-6">
              Thank you for reaching out. Sergio will review your message and get back to you within 24-48 hours.
            </p>
            <Button 
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-text-primary">Contact Sergio</CardTitle>
        <CardDescription className="text-text-secondary">
          Fill out the form below and Sergio will get back to you personally within 24-48 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Anti-spam honeypot field (hidden) */}
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Your full name"
                        className="bg-surface border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-surface border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-surface border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Subject *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="What would you like to discuss?"
                        className="bg-surface border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Please share your trading experience, goals, and any specific questions you have for Sergio..."
                      className="bg-surface border-border focus:border-primary transition-colors min-h-[120px] resize-none"
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-3 h-auto transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-text-muted text-center">
              * Required fields. Your information is kept confidential and secure.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;