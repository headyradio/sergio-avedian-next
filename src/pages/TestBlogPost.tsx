import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import CTAPopup from "@/components/CTAPopup";
import CTATestButton from "@/components/CTATestButton";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { useExitIntent } from "@/hooks/useExitIntent";

const TestBlogPost = () => {
  // CTA Popup triggers with reduced times for testing
  const { shouldTrigger: scrollTrigger, resetTrigger: resetScrollTrigger } = useScrollTrigger({
    threshold: 0.3, // Trigger at 30% scroll instead of 65%
    minTimeOnPage: 5000, // 5 seconds instead of 30
    cooldownPeriod: 5 * 60 * 1000 // 5 minutes instead of 24 hours for testing
  });
  const { shouldTrigger: exitTrigger, resetTrigger: resetExitTrigger } = useExitIntent({
    minTimeOnPage: 3000, // 3 seconds instead of 20
    sensitivity: 50,
    cooldownPeriod: 5 * 60 * 1000 // 5 minutes instead of 24 hours for testing
  });
  
  const [showCTAPopup, setShowCTAPopup] = useState(false);

  // Combine triggers - show popup if either scroll or exit intent triggers
  useEffect(() => {
    console.log(`CTA TestBlog: Triggers check - scroll: ${scrollTrigger}, exit: ${exitTrigger}, showPopup: ${showCTAPopup}`);
    if ((scrollTrigger || exitTrigger) && !showCTAPopup) {
      console.log(`CTA TestBlog: SHOWING POPUP!`);
      setShowCTAPopup(true);
    }
  }, [scrollTrigger, exitTrigger, showCTAPopup]);

  const handleCloseCTAPopup = () => {
    setShowCTAPopup(false);
    resetScrollTrigger();
    resetExitTrigger();
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressIndicator />
      <Navigation />
      
      {/* Back Navigation */}
      <div className="py-6 bg-background">
        <div className="editorial-container max-w-4xl">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-cta/20"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Article Title */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-text-primary leading-tight mb-6">
            Test Article: CTA Popup Demo
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            This is a test article to demonstrate the CTA popup functionality. Scroll down 30% or try to exit the page to trigger the popup.
          </p>
        </div>
      </section>

      {/* Article Byline */}
      <section className="py-8 border-b border-border/20">
        <div className="editorial-container max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-6 text-text-muted">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">By Sergio Avedian</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>September 21, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 lg:py-20">
        <div className="editorial-container max-w-4xl">
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <h2>Testing CTA Popup Functionality</h2>
            
            <p>
              This test page demonstrates how the CTA popup works. The popup will trigger in two scenarios:
            </p>
            
            <h3>Scroll Trigger</h3>
            <p>
              When you scroll down to 30% of the article content (after being on the page for 5 seconds), 
              the popup will appear with subscription options.
            </p>
            
            <h3>Exit Intent</h3>
            <p>
              If you move your mouse toward the top of the browser (as if to close the tab or navigate away) 
              after being on the page for 3 seconds, the popup will trigger.
            </p>
            
            <h3>Testing Instructions</h3>
            <ol>
              <li><strong>Scroll Test:</strong> Wait 5 seconds, then scroll down slowly. The popup should appear around 30% scroll.</li>
              <li><strong>Exit Intent Test:</strong> Wait 3 seconds, then quickly move your mouse to the very top of the browser window.</li>
              <li><strong>Manual Test:</strong> Use the "Test CTA Popup" button in the bottom-right corner.</li>
            </ol>
            
            <h3>Cooldown Period</h3>
            <p>
              Once the popup appears and is dismissed, it won't appear again for 5 minutes (reduced from 24 hours for testing).
            </p>
            
            <div style={{ height: '200vh', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))' }}>
              <p>
                Keep scrolling to test the scroll trigger... This content is intentionally long to provide enough 
                scroll distance for testing the 30% threshold.
              </p>
              
              <p style={{ marginTop: '50vh' }}>
                You're halfway through the scrollable content. The popup should have triggered by now if you've 
                been on the page for at least 5 seconds.
              </p>
              
              <p style={{ marginTop: '50vh' }}>
                This is the end of the test content. If you haven't seen the popup yet, try the exit intent 
                test by moving your mouse to the top of the browser window.
              </p>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      
      {/* CTA Popup */}
      <CTAPopup 
        isOpen={showCTAPopup} 
        onClose={handleCloseCTAPopup} 
      />
      
      {/* Test Button for CTA Popup */}
      <CTATestButton />
    </div>
  );
};

export default TestBlogPost;