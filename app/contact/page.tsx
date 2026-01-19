import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sergio Avedian. Questions about trading, investing, or personal coaching? Reach out today.",
  openGraph: {
    title: "Contact Sergio Avedian",
    description: "Get in touch with Sergio Avedian for trading and investment questions.",
    url: "https://sergioavedian.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 lg:py-32">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Get In Touch
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Have questions about trading, investing, or personal coaching? 
                I&apos;d love to hear from you.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
