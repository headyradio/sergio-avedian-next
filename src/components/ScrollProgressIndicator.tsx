import { useState, useEffect, useRef } from 'react';
import { rafThrottle } from '@/lib/rafUtils';

const ScrollProgressIndicator = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cachedDocHeightRef = useRef(0);
  const cachedInnerHeightRef = useRef(0);

  useEffect(() => {
    // Batch layout reads together to prevent forced reflows
    const updateCache = () => {
      cachedDocHeightRef.current = document.documentElement.scrollHeight;
      cachedInnerHeightRef.current = window.innerHeight;
    };
    
    // Update cache on mount and resize
    updateCache();
    window.addEventListener('resize', rafThrottle(updateCache), { passive: true });

    // Throttle scroll handler with RAF to batch reads per frame
    const handleScroll = rafThrottle(() => {
      // Batch all layout reads together
      const scrollTop = window.scrollY;
      const docHeight = cachedDocHeightRef.current - cachedInnerHeightRef.current;
      
      // All reads complete, now batch writes
      const scrollPercent = (scrollTop / docHeight) * 100;
      const newProgress = Math.min(Math.max(scrollPercent, 0), 100);
      const newIsVisible = scrollTop > 100;
      
      setProgress(newProgress);
      setIsVisible(newIsVisible);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCache);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-1 bg-surface/80 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-primary via-brand-secondary to-cta-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div 
        className="absolute top-0 h-full w-8 bg-gradient-to-r from-primary to-transparent opacity-80 blur-sm transition-all duration-300"
        style={{ left: `${Math.max(progress - 8, 0)}%` }}
      />
    </div>
  );
};

export default ScrollProgressIndicator;