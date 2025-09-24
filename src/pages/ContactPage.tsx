import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Sergio Avedian - Get Trading & Investment Guidance</title>
        <meta 
          name="description" 
          content="Contact Sergio Avedian for personalized trading mentorship, investment coaching, and market analysis. Get expert guidance from a Wall Street veteran with 35+ years experience." 
        />
        <meta name="keywords" content="contact Sergio Avedian, trading mentor, investment coaching, Wall Street guidance, financial consultation" />
        <link rel="canonical" href="/contact" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
          <div className="editorial-container">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-primary leading-tight">
                Contact Sergio
              </h1>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-16 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;