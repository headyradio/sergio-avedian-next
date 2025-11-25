import { useState, useEffect } from 'react';

const ScrollProgressIndicator = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setProgress(Math.min(Math.max(scrollPercent, 0), 100));
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
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