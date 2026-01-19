import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and Conditions for SergioAvedian.com - Educational platform offering trading courses, coaching, and market insights.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
              
              <p>These Terms and Conditions govern access to and use of the SergioAvedian.com website and related services. By accessing the website, purchasing courses, enrolling in coaching, or otherwise using any services, users agree to these Terms.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">About SergioAvedian.com</h2>
              <p>SergioAvedian.com is a U.S.-based educational platform offering online courses, webinars, coaching, articles, videos, newsletters, and related digital resources intended for informational and educational purposes only.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Important Financial Disclaimer</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>SergioAvedian.com is not a registered investment adviser, broker-dealer, or financial planner.</li>
                <li>All information is provided for general educational purposes only.</li>
                <li>No outcome is promised or guaranteed; results vary.</li>
                <li>Investing involves risk, including the possible loss of principal.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">100% Satisfaction Guaranteed</h2>
              <p>If you are dissatisfied with paid coaching, webinar or course you have purchased, we will offer a full refund upon request.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
