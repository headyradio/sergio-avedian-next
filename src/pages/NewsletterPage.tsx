import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { Users, TrendingUp, BookOpen, Shield } from "lucide-react";

const NewsletterPage = () => {
  return (
    <>
      <Helmet>
        <title>Subscribe to Sergio Avedian's Newsletter | Investment Insights & Trading Psychology</title>
        <meta 
          name="description" 
          content="Get practical, no-hype investment guidance from Sergio Avedian. 35+ years Wall Street experience. Proven long-term strategies and trading psychology tips. Trusted by thousands of subscribers." 
        />
        <meta property="og:title" content="Subscribe to Sergio Avedian's Newsletter" />
        <meta property="og:description" content="Join thousands of investors building wealth without a financial advisor. Get Sergio's proven long-term strategies delivered to your inbox." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sergioavedian.com/newsletter" />
        <link rel="canonical" href="https://sergioavedian.com/newsletter" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            
            <div className="editorial-container relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Subscriber Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-text-secondary">
                    Join <span className="text-primary font-bold">thousands of</span> Active Subscribers
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                  Build Wealth Without a{" "}
                  <span className="text-gradient">Financial Advisor</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                  Get Sergio Avedian's proven long-term investment strategies and trading psychology insights delivered straight to your inbox.
                </p>

                {/* Trust Indicator */}
                <div className="flex items-center justify-center gap-2 text-text-muted">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">35+ years of Wall Street experience</span>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Form Section */}
          <section className="py-12 sm:py-16">
            <div className="editorial-container">
              <NewsletterForm />
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 sm:py-20 bg-surface/50">
            <div className="editorial-container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-text-primary mb-12">
                  What You'll Get
                </h2>
                
                <div className="grid sm:grid-cols-3 gap-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      Weekly Market Insights
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Get actionable market analysis and trading opportunities based on 35+ years of experience.
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20">
                      <BookOpen className="w-8 h-8 text-brand-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      Proven Strategies
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Learn the same long-term investment strategies that have built wealth for thousands.
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20">
                      <Users className="w-8 h-8 text-brand-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      No-Hype Guidance
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Practical, straightforward advice focused on building wealth, not chasing trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-16 sm:py-20">
            <div className="editorial-container">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="glass-card p-8 sm:p-10 rounded-2xl">
                  <blockquote className="space-y-4">
                    <p className="text-lg sm:text-xl text-text-secondary italic leading-relaxed">
                      "New to investing or already an active trader, get practical, no-hype guidance focused on building wealth without a financial advisor. Proven long-term strategies and compounding made simple."
                    </p>
                    <footer className="text-text-primary font-semibold">
                      — Sergio Avedian
                    </footer>
                  </blockquote>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span>No spam, ever</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span>Your data is secure</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NewsletterPage;
