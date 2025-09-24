import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Remove the # from the hash
      const elementId = location.hash.substring(1);
      
      // Small delay to ensure the element is rendered
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, location.pathname]);
};

export default useScrollToAnchor;