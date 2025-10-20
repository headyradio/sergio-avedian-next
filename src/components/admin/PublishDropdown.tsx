import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Zap, Calendar, Mail } from 'lucide-react';

interface PublishDropdownProps {
  onPublishNow: () => void;
  onSchedule: () => void;
  onPublishWithNewsletter: () => void;
  isPublished?: boolean;
  disabled?: boolean;
}

export const PublishDropdown = ({
  onPublishNow,
  onSchedule,
  onPublishWithNewsletter,
  isPublished = false,
  disabled = false,
}: PublishDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} className="gap-2">
          {isPublished ? 'Update' : 'Publish'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onPublishNow} className="gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium">Publish Now</div>
            <div className="text-xs text-muted-foreground">
              Make live immediately
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onSchedule} className="gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <div>
            <div className="font-medium">Schedule...</div>
            <div className="text-xs text-muted-foreground">
              Choose date & time
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onPublishWithNewsletter} className="gap-2">
          <Mail className="h-4 w-4 text-purple-600" />
          <div>
            <div className="font-medium">Publish & Send Newsletter...</div>
            <div className="text-xs text-muted-foreground">
              Configure web & email
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
