import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CookiePolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - Sergio Avedian</title>
        <meta 
          name="description" 
          content="Cookie Policy for SergioAvedian.com - How we use cookies and similar technologies on our website." 
        />
        <link rel="canonical" href="/cookie-policy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-text-primary">Cookie Policy</h1>
              
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
                
                <p>This Cookie Policy explains how SergioAvedian.com uses cookies and similar technologies when you visit our website.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">What Are Cookies</h2>
                <p>Cookies are small text files that are placed on your device when you visit a website. They help the website remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How We Use Cookies</h2>
                <p>We use cookies to enhance your experience on our website, analyze website traffic, and for marketing purposes. This helps us improve our services and provide you with more relevant content.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Types of Cookies We Use</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly.</li>
                  <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website.</li>
                  <li><strong>Marketing Cookies:</strong> These are used to track visitors across websites for marketing purposes.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Managing Cookies</h2>
                <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact Us</h2>
                <p>If you have any questions about this Cookie Policy, please contact us at:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p>Email: sergio@sergioavedian.com</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CookiePolicyPage;