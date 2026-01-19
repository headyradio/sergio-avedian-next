import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for SergioAvedian.com - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
              
              <p>This Privacy Policy explains how SergioAvedian.com collects, uses, and protects your personal information when you use our website and services.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
                <li><strong>Contact Information:</strong> Information you provide when contacting us or subscribing to our newsletter.</li>
                <li><strong>Usage Data:</strong> How you interact with our website, including pages visited and features used.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our services</li>
                <li>To send newsletters and marketing communications (with your consent)</li>
                <li>To respond to your inquiries</li>
                <li>To analyze and improve our website</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data by contacting us.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>

              <p className="text-sm text-text-muted">
                See also our <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
