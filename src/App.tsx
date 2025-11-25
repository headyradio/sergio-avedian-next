import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CMSDemo from "./pages/CMSDemo";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Direct imports for critical pages to prevent loading issues
import AboutPage from "./pages/AboutPage";
import CoachingPage from "./pages/CoachingPage";
import ContactPage from "./pages/ContactPage";

// Lazy load routes for code splitting - reduces initial bundle size
import {
  AdminDashboard,
  AdminLogin,
  CMSBlogListPage,
  CMSBlogPostPage,
  CMSBlogPreviewPage,
  NewsletterPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage,
} from "@/lib/lazyComponents";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-foreground">Loading...</div>
  </div>
);

const App = () => {
  // Create QueryClient inside the component to ensure React context is available
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="sergio-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* Skip to main content link for keyboard users */}
              <a href="#main-content" className="skip-to-content">
                Skip to main content
              </a>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/coaching" element={<CoachingPage />} />
                  <Route path="/about-sergio" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/newsletter" element={<NewsletterPage />} />
                  <Route path="/blog" element={<CMSBlogListPage />} />
                  <Route path="/blog/:slug" element={<CMSBlogPostPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="/cms-demo" element={<CMSDemo />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/blog-preview/:id" 
                    element={
                      <ProtectedRoute>
                        <CMSBlogPreviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
