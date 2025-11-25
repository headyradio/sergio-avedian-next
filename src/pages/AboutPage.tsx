import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import sergioImage from "@/assets/sergio-hero-main.png";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Sergio Avedian - 35+ Years Wall Street Experience</title>
        <meta 
          name="description" 
          content="Meet Sergio Avedian, a seasoned Wall Street professional with over 35 years of experience in finance, trading, and capital markets. Learn about his journey and expertise." 
        />
        <meta name="keywords" content="Sergio Avedian, Wall Street, finance, trading, investment, mentor, financial education" />
        <link rel="canonical" href="https://sergioavedian.com/about-sergio" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-text-primary leading-tight">
                  Meet Sergio Avedian
                </h1>
                <p className="text-xl lg:text-2xl text-text-secondary mb-8 leading-relaxed">
                  A seasoned Wall Street professional with more than 35 years of experience in finance, trading, and capital markets.
                </p>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">35+</div>
                    <div className="text-sm text-text-muted uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">Multiple</div>
                    <div className="text-sm text-text-muted uppercase tracking-wide">Market Cycles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">Thousands</div>
                    <div className="text-sm text-text-muted uppercase tracking-wide">Lives Impacted</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-brand-secondary/20 rounded-2xl transform rotate-6 blur-xl"></div>
                  <img 
                    src={sergioImage} 
                    alt="Sergio Avedian - Wall Street Professional and Trading Mentor"
                    className="relative w-full max-w-md lg:max-w-lg rounded-2xl shadow-large"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="py-16 lg:py-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <div className="prose-modern">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-text-primary">
                  A Career Spanning Decades of Market Evolution
                </h2>
                
                <div className="space-y-6 text-lg">
                  <p>
                    Sergio Avedian is a seasoned Wall Street professional with more than 35 years of experience in finance, trading, and capital markets. Over the course of his career, he has navigated multiple market cycles, from the roaring bull runs to historic downturns, giving him a rare perspective that blends deep technical/fundamental expertise with hard-earned practical wisdom.
                  </p>

                  <p>
                    Beginning his career on Wall Street in the late 1980s, Sergio quickly established himself as a skilled trader with a sharp eye for market dynamics and risk management. He has held senior roles across leading financial institutions, specializing in equities, derivatives, and structured products. His ability to adapt to rapidly changing market environments and identify opportunities ahead of the curve has been a defining feature of his professional journey.
                  </p>

                  <p>
                    What truly sets Sergio apart is his pay-it-forward philosophy. Having benefited from mentors early in his career, he has made it a mission to give back by teaching others how to invest and trade responsibly. Whether through one-on-one mentorship, workshops, or educational content, Sergio shares not just strategies for success but also lessons in discipline, patience, and emotional resilience—the qualities that separate short-term speculators from long-term winners.
                  </p>

                  <p>
                    Today, Sergio continues to trade actively while devoting much of his time to educating the next generation of investors/traders. He believes that financial literacy is the foundation of independence and that anyone, regardless of background, can learn to build wealth with the right guidance. His approach emphasizes transparency, integrity, and a deep respect for the markets.
                  </p>

                  <p>
                    Sergio's career stands as a testament to the power of knowledge, persistence, and generosity—and his legacy is defined as much by the people he has helped as by the trades he has made.
                  </p>
                </div>

                <div className="mt-12 p-8 glass-card rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">Core Philosophy</h3>
                  <blockquote className="text-xl italic text-text-secondary border-l-4 border-primary pl-6">
                    "Financial literacy is the foundation of independence. Anyone, regardless of background, can learn to build wealth with the right guidance, discipline, and respect for the markets."
                  </blockquote>
                  <cite className="block mt-4 text-text-muted">— Sergio Avedian</cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-text-primary">
                  Get In Touch
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                  Ready to take your trading and investment journey to the next level? Reach out to Sergio for personalized guidance and mentorship opportunities.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;