import { useState } from "react";
import { Button } from "@/components/ui/button";
import CTAPopup from "./CTAPopup";

const CTATestButton = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => setShowPopup(true)}
        variant="cta"
        size="sm"
        className="shadow-lg"
      >
        Test CTA Popup
      </Button>
      
      <CTAPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
    </div>
  );
};

export default CTATestButton;