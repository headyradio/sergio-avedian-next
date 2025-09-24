import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-text-primary leading-tight">
                Get In Touch
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary mb-12 leading-relaxed">
                Ready to take your trading and investment journey to the next level? Reach out for personalized guidance and mentorship opportunities.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="glass-card p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">Email</h3>
                <p className="text-text-secondary text-sm">Get a response within 24 hours</p>
              </div>
              
              <div className="glass-card p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">Consultation</h3>
                <p className="text-text-secondary text-sm">Schedule a one-on-one session</p>
              </div>
              
              <div className="glass-card p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">Response Time</h3>
                <p className="text-text-secondary text-sm">Usually within 24 hours</p>
              </div>
              
              <div className="glass-card p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">Location</h3>
                <p className="text-text-secondary text-sm">Virtual consultations available</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-text-primary">
                  Send a Message
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                  Whether you're interested in personal coaching, have questions about trading strategies, or want to discuss investment opportunities, I'm here to help.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-text-primary text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-8">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">What type of coaching do you provide?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    I offer personalized trading and investment coaching covering options strategies, risk management, market analysis, and portfolio construction. Sessions are tailored to your experience level and goals.
                  </p>
                </div>
                
                <div className="glass-card p-8">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">How long does it take to get a response?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    I typically respond to all inquiries within 24 hours. For urgent matters, please mention it in your message subject line.
                  </p>
                </div>
                
                <div className="glass-card p-8">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Do you offer group sessions?</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Yes, I conduct both individual and small group sessions. Group sessions are great for learning alongside peers and are more cost-effective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;