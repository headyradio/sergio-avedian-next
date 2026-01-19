"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Mail, Youtube } from "lucide-react";
import EmailSubscriptionModal from "./EmailSubscriptionModal";

interface SubscribeDropdownProps {
  variant?: "cta" | "default";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const SubscribeDropdown = ({ variant = "cta", size = "sm", className }: SubscribeDropdownProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleYouTubeSubscribe = () => {
    window.open("https://www.youtube.com/@SergioAvedian/", "_blank", "noopener,noreferrer");
  };

  const handleEmailSubscribe = () => {
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            Subscribe
            <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-card border-card-border shadow-large animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuItem 
            onClick={handleYouTubeSubscribe}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-text-primary">YouTube Channel</span>
              <span className="text-xs text-text-secondary">Subscribe for video content</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleEmailSubscribe}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Mail className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-text-primary">Email Newsletter</span>
              <span className="text-xs text-text-secondary">Get weekly insights</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailSubscriptionModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen} 
      />
    </>
  );
};

export default SubscribeDropdown;