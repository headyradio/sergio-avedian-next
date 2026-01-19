import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to Sergio Avedian's newsletter for weekly insights on trading, investing, and building wealth from a Wall Street veteran.",
  openGraph: {
    title: "Subscribe to Sergio Avedian's Newsletter",
    description: "Get weekly insights on trading and investing from a 35-year Wall Street veteran.",
    url: "https://sergioavedian.com/newsletter",
  },
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 lg:py-32">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Join the Newsletter
            </h1>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
              Get weekly insights, market analysis, and practical trading wisdom 
              delivered straight to your inbox. No spam, just value.
            </p>
            
            <div className="glass-card p-8 md:p-12 rounded-2xl">
              <NewsletterForm />
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Weekly</div>
                <div className="text-text-muted">Market Insights</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">35+ Years</div>
                <div className="text-text-muted">Of Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Free</div>
                <div className="text-text-muted">No Credit Card</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
