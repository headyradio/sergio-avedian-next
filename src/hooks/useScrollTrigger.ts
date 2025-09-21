import { useState, useEffect, useRef } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number; // Percentage of content scrolled (0-1)
  minTimeOnPage?: number; // Minimum time in milliseconds before trigger
  cooldownPeriod?: number; // Cooldown in milliseconds
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}) => {
  const { 
    threshold = 0.65, // 65% through content
    minTimeOnPage = 30000, // 30 seconds
    cooldownPeriod = 24 * 60 * 60 * 1000 // 24 hours
  } = options;
  
  const [shouldTrigger, setShouldTrigger] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const hasMetThresholdRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if popup was recently dismissed
    const lastDismissed = localStorage.getItem('ctaPopupDismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < cooldownPeriod) {
      return;
    }

  const handleScroll = () => {
    // Check if minimum time has passed
    const timeElapsed = Date.now() - startTimeRef.current;
    if (timeElapsed < minTimeOnPage) {
      console.log(`CTA Scroll: Time check failed - ${timeElapsed}ms < ${minTimeOnPage}ms`);
      return;
    }

    // Check if already triggered
    if (hasTriggered || hasMetThresholdRef.current) {
      console.log(`CTA Scroll: Already triggered - hasTriggered: ${hasTriggered}, hasMetThreshold: ${hasMetThresholdRef.current}`);
      return;
    }

    // Calculate scroll progress through main content
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Try to find main content area, fallback to full document
    const mainContent = document.querySelector('main') || document.querySelector('article') || document.body;
    const contentHeight = mainContent.scrollHeight;
    const contentTop = mainContent.offsetTop || 0;
    
    // Calculate scroll progress relative to content
    const scrollProgress = Math.min(
      Math.max((scrollTop + windowHeight - contentTop) / contentHeight, 0),
      1
    );

    console.log(`CTA Scroll: Progress ${(scrollProgress * 100).toFixed(1)}% (threshold: ${(threshold * 100).toFixed(1)}%)`);

    if (scrollProgress >= threshold) {
      console.log(`CTA Scroll: TRIGGERED! Setting popup to show`);
      hasMetThresholdRef.current = true;
      setShouldTrigger(true);
      setHasTriggered(true);
    }
  };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, minTimeOnPage, hasTriggered, cooldownPeriod]);

  const resetTrigger = () => {
    setShouldTrigger(false);
  };

  return { shouldTrigger, resetTrigger, hasTriggered };
};