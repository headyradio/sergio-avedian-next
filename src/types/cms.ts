// CMS Content Types for Hygraph

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: string;
  readTime: string;
  featured: boolean;
  coverImage?: {
    url: string;
    alt?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface HomePageContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCTaSecondary: string;
  statsSubscribers: string;
  statsNewsletter: string;
  statsVideos: string;
  heroImage?: {
    url: string;
    alt?: string;
  };
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

export interface FooterContent {
  id: string;
  description: string;
  newsletterTitle: string;
  newsletterDescription: string;
  copyrightText: string;
  socialLinks: {
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  footerLinks: Array<{
    section: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

export interface GlobalSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
}