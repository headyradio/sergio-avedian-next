import { useState, useEffect, useRef } from 'react';

interface UseExitIntentOptions {
  minTimeOnPage?: number; // Minimum time in milliseconds before trigger
  sensitivity?: number; // Distance from top of page to trigger (pixels)
  cooldownPeriod?: number; // Cooldown in milliseconds
}

export const useExitIntent = (options: UseExitIntentOptions = {}) => {
  const { 
    minTimeOnPage = 20000, // 20 seconds
    sensitivity = 50, // 50px from top
    cooldownPeriod = 24 * 60 * 60 * 1000 // 24 hours
  } = options;
  
  const [shouldTrigger, setShouldTrigger] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if popup was recently dismissed
    const lastDismissed = localStorage.getItem('ctaPopupDismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < cooldownPeriod) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if minimum time has passed
      if (Date.now() - startTimeRef.current < minTimeOnPage) {
        return;
      }

      // Check if already triggered
      if (hasTriggered) {
        return;
      }

      // Check if mouse is leaving from the top of the page
      if (e.clientY <= sensitivity && e.relatedTarget === null) {
        // Add a small delay to avoid false positives
        timeoutRef.current = setTimeout(() => {
          setShouldTrigger(true);
          setHasTriggered(true);
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      // Clear timeout if mouse re-enters quickly
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };

    // Only listen on desktop (not mobile)
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
    }
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minTimeOnPage, sensitivity, hasTriggered, cooldownPeriod]);

  const resetTrigger = () => {
    setShouldTrigger(false);
  };

  return { shouldTrigger, resetTrigger, hasTriggered };
};