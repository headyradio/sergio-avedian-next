import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for SergioAvedian.com - How we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
              
              <p>This Cookie Policy explains how SergioAvedian.com uses cookies and similar technologies on our website.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences and improve your experience.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>

              <p className="text-sm text-text-muted">
                See also our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
