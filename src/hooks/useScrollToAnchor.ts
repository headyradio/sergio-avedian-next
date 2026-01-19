"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const useScrollToAnchor = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the hash from the URL
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    
    if (hash) {
      // Remove the # from the hash
      const elementId = hash.slice(1);
      const element = document.getElementById(elementId);
      
      if (element) {
        // Small delay to ensure the DOM is ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [pathname, searchParams]);
};

export default useScrollToAnchor;