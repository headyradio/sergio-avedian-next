/**
 * Lazy-loaded components for route-based code splitting
 * Reduces initial bundle size by loading components only when needed
 */
import { lazy } from 'react';

// Admin pages - loaded only when accessing admin routes
export const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const AdminLogin = lazy(() => import('@/pages/AdminLogin'));

// Blog pages - loaded only when accessing blog routes
export const CMSBlogListPage = lazy(() => import('@/pages/CMSBlogListPage'));
export const CMSBlogPostPage = lazy(() => import('@/pages/CMSBlogPostPage'));
export const CMSBlogPreviewPage = lazy(() => import('@/pages/CMSBlogPreviewPage'));

// Static pages - NewsletterPage can be lazy loaded, others load directly for stability
export const NewsletterPage = lazy(() => import('@/pages/NewsletterPage'));
export const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
export const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
export const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
