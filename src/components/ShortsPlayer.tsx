import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortsPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const ShortsPlayer = ({ isOpen, onClose, videoId, title }: ShortsPlayerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-black border-none overflow-hidden">
        <DialogHeader className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-sm font-medium truncate pr-4">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="aspect-[9/16] w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortsPlayer;