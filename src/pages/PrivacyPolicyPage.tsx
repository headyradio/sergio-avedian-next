import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Sergio Avedian</title>
        <meta 
          name="description" 
          content="Privacy Policy for SergioAvedian.com - How we collect, use, and protect your personal information." 
        />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-text-primary">Privacy Policy</h1>
              
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
                
                <p>This Privacy Policy describes how SergioAvedian.com ("we," "us," or "our") collects, uses, and protects your personal information when you visit our website or use our services.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Information We Collect</h2>
                <p>We may collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, contact us, or use our services.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Your Rights</h2>
                <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicyPage;