"use client";

import { Twitter, Linkedin, Mail } from "lucide-react";

interface SocialShareButtonsProps {
  title: string;
  slug: string;
}

export default function SocialShareButtons({ title, slug }: SocialShareButtonsProps) {
  const baseUrl = "https://sergioavedian.com";
  const url = `${baseUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodedTitle}&body=Check out this article by Sergio Avedian: ${encodedUrl}`,
      "_self"
    );
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-[#1DA1F2]"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-[#0A66C2]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        onClick={shareViaEmail}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-foreground"
        aria-label="Share via Email"
      >
        <Mail className="w-4 h-4" />
      </button>
    </div>
  );
}
