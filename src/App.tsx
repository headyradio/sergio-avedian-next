import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import Index from "./pages/Index";
import CoachingPage from "./pages/CoachingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NewsletterPage from "./pages/NewsletterPage";
import NotFound from "./pages/NotFound";
import CMSDemo from "./pages/CMSDemo";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import CMSBlogListPage from "./pages/CMSBlogListPage";
import CMSBlogPostPage from "./pages/CMSBlogPostPage";
import TestBlogPost from "./pages/TestBlogPost";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

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
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/coaching" element={<CoachingPage />} />
              <Route path="/about-sergio" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/blog" element={<CMSBlogListPage />} />
              <Route path="/blog/:slug" element={<CMSBlogPostPage />} />
              <Route path="/test-blog" element={<TestBlogPost />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
