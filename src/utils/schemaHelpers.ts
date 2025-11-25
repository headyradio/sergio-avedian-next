/**
 * Schema.org Structured Data Helpers
 * 
 * Utilities for generating JSON-LD structured data for SEO.
 * Following schema.org and Google Rich Results guidelines (2025).
 */

export interface PersonSchema {
  name: string;
  jobTitle?: string;
  url?: string;
  email?: string;
  image?: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  founder?: PersonSchema;
  sameAs?: string[];
  contactPoint?: {
    contactType: string;
    email?: string;
    telephone?: string;
    url?: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate FAQ Schema for FAQ pages
 */
export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate Course Schema for educational content
 */
export const generateCourseSchema = (course: {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": course.provider,
      "url": "https://sergioavedian.com"
    },
    "url": course.url,
    ...(course.image && { "image": course.image }),
    ...(course.price && {
      "offers": {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": course.currency || "USD",
        "availability": "https://schema.org/InStock"
      }
    })
  };
};

/**
 * Generate Event Schema for webinars and events
 */
export const generateEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image?: string;
  organizer?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    ...(event.endDate && { "endDate": event.endDate }),
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": event.url
    },
    ...(event.image && { "image": event.image }),
    "organizer": {
      "@type": "Organization",
      "name": event.organizer || "Sergio Avedian",
      "url": "https://sergioavedian.com"
    }
  };
};

/**
 * Generate Video Schema for YouTube content
 */
export const generateVideoSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "contentUrl": video.contentUrl,
    ...(video.duration && { "duration": video.duration }),
    "publisher": {
      "@type": "Organization",
      "name": "Sergio Avedian",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sergioavedian.com/favicon.png"
      }
    }
  };
};

/**
 * Generate Person Schema for author/about pages
 */
export const generatePersonSchema = (person: {
  name: string;
  jobTitle?: string;
  description?: string;
  url: string;
  image?: string;
  email?: string;
  sameAs?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    ...(person.jobTitle && { "jobTitle": person.jobTitle }),
    ...(person.description && { "description": person.description }),
    "url": person.url,
    ...(person.image && { "image": person.image }),
    ...(person.email && { "email": person.email }),
    ...(person.sameAs && person.sameAs.length > 0 && { "sameAs": person.sameAs })
  };
};

/**
 * Generate BreadcrumbList Schema for navigation
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};
