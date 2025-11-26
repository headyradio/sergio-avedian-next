import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import xLogo from "@/assets/x-logo-white.png";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShareButtons = ({ url, title, description }: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-text-muted uppercase tracking-wide">Share</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          aria-label="Share on X (Twitter)"
        >
          <img src={xLogo} alt="X" className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => window.location.href = shareLinks.email}
          aria-label="Share via Email"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};