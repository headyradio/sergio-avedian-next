import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Mail, 
  Clock, 
  Zap, 
  CalendarClock, 
  CheckCircle,
  Send,
  FileText,
  ExternalLink,
  Info
} from "lucide-react";

interface PublishOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id: string;
    title: string;
    published: boolean;
    published_at?: string;
    sent_to_kit?: boolean;
    kit_status?: string;
    kit_broadcast_id?: string;
  };
  onPublish: (data: {
    target: 'web' | 'newsletter' | 'both';
    webAction: 'now' | 'schedule';
    webScheduleTime?: string;
    newsletterAction?: 'draft' | 'schedule' | 'send_now';
    newsletterScheduleTime?: string;
  }) => void;
}

export const PublishOptionsDialog = ({
  open,
  onOpenChange,
  post,
  onPublish,
}: PublishOptionsDialogProps) => {
  // Format datetime for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialWebScheduleTime = formatDateTimeLocal(post.published_at);
  const hasWebSchedule = post.published_at && !post.published;

  const [webEnabled, setWebEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [webAction, setWebAction] = useState<'now' | 'schedule'>(hasWebSchedule ? 'schedule' : 'now');
  const [webScheduleTime, setWebScheduleTime] = useState(initialWebScheduleTime);
  const [newsletterAction, setNewsletterAction] = useState<'draft' | 'schedule' | 'send_now'>('draft');
  const [newsletterScheduleTime, setNewsletterScheduleTime] = useState('');

  const handlePublish = () => {
    if (!webEnabled && !newsletterEnabled) return;

    let target: 'web' | 'newsletter' | 'both';
    if (webEnabled && newsletterEnabled) {
      target = 'both';
    } else if (webEnabled) {
      target = 'web';
    } else {
      target = 'newsletter';
    }

    onPublish({
      target,
      webAction: webEnabled ? webAction : 'now',
      webScheduleTime: webEnabled && webAction === 'schedule' ? webScheduleTime : undefined,
      newsletterAction: newsletterEnabled ? newsletterAction : undefined,
      newsletterScheduleTime: newsletterEnabled && newsletterAction === 'schedule' ? newsletterScheduleTime : undefined,
    });
    onOpenChange(false);
  };

  // Dynamic button text
  const getButtonText = () => {
    if (webEnabled && newsletterEnabled) {
      if (webAction === 'schedule' || newsletterAction === 'schedule') {
        return 'Schedule Both';
      }
      return 'Publish & Send';
    } else if (webEnabled) {
      return webAction === 'now' ? 'Publish Now' : 'Schedule Publish';
    } else if (newsletterEnabled) {
      if (newsletterAction === 'draft') return 'Save Draft';
      if (newsletterAction === 'schedule') return 'Schedule Send';
      return 'Send Now';
    }
    return 'Publish';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Publish "{post.title}"</DialogTitle>
          <DialogDescription>
            Choose how you want to publish your content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Toggle Checkboxes */}
          <div className="space-y-3">
            <div 
              className="flex items-start space-x-3 p-4 rounded-lg border-2 bg-card hover:bg-accent/5 transition-colors cursor-pointer" 
              onClick={() => setWebEnabled(!webEnabled)}
            >
              <Checkbox 
                id="web-toggle" 
                checked={webEnabled} 
                onCheckedChange={(checked) => setWebEnabled(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="web-toggle" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">Publish to web</div>
                    <div className="text-sm text-muted-foreground">
                      Make your post live on the website
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <div 
              className="flex items-start space-x-3 p-4 rounded-lg border-2 bg-card hover:bg-accent/5 transition-colors cursor-pointer" 
              onClick={() => setNewsletterEnabled(!newsletterEnabled)}
            >
              <Checkbox 
                id="newsletter-toggle" 
                checked={newsletterEnabled} 
                onCheckedChange={(checked) => setNewsletterEnabled(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="newsletter-toggle" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">Send email</div>
                    <div className="text-sm text-muted-foreground">
                      Send to subscribers via newsletter
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </div>

          {/* WEB SECTION */}
          {webEnabled && (
            <div className="space-y-4 p-5 rounded-lg border bg-card animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 pb-3 border-b">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Web Publishing</h3>
              </div>

              <Alert className="bg-muted/50 border-muted">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Publish to your website to make it publicly visible
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <RadioGroup value={webAction} onValueChange={(v) => setWebAction(v as any)}>
                  <div className="relative">
                    <RadioGroupItem value="now" id="web-now" className="peer sr-only" />
                    <Label 
                      htmlFor="web-now" 
                      className="flex items-start gap-3 p-4 rounded-lg border-2 bg-background cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/10 transition-colors"
                    >
                      <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Publish Now</div>
                        <div className="text-sm text-muted-foreground">
                          Make live on website immediately
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="schedule" id="web-schedule" className="peer sr-only" />
                    <Label 
                      htmlFor="web-schedule" 
                      className="flex items-start gap-3 p-4 rounded-lg border-2 bg-background cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/10 transition-colors"
                    >
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Schedule</div>
                        <div className="text-sm text-muted-foreground">
                          Set a specific date and time to publish
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {webAction === 'schedule' && (
                  <div className="space-y-3 pl-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="web-schedule-time" className="text-sm font-medium">
                      Select Date & Time
                    </Label>
                    <Input
                      id="web-schedule-time"
                      type="datetime-local"
                      value={webScheduleTime}
                      onChange={(e) => setWebScheduleTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="max-w-sm"
                    />
                    {webScheduleTime && (
                      <p className="text-sm text-muted-foreground">
                        Will publish on {new Date(webScheduleTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NEWSLETTER SECTION */}
          {newsletterEnabled && (
            <div className="space-y-4 p-5 rounded-lg border bg-card animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 pb-3 border-b">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Newsletter</h3>
              </div>

              {post.sent_to_kit && (
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="flex items-center justify-between gap-2 text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ConvertKit Status:</span>
                      <Badge variant="outline" className="bg-background">
                        {post.kit_status || 'sent'}
                      </Badge>
                    </div>
                    {post.kit_broadcast_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://app.convertkit.com/broadcasts/${post.kit_broadcast_id}`, '_blank')}
                        className="shrink-0"
                      >
                        View in Kit <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="bg-muted/50 border-muted">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Send your blog post to subscribers via ConvertKit
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <RadioGroup value={newsletterAction} onValueChange={(v) => setNewsletterAction(v as any)}>
                  <div className="relative">
                    <RadioGroupItem value="draft" id="newsletter-draft" className="peer sr-only" />
                    <Label 
                      htmlFor="newsletter-draft" 
                      className="flex items-start gap-3 p-4 rounded-lg border-2 bg-background cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Save as Draft</div>
                        <div className="text-sm text-muted-foreground">
                          Creates draft in ConvertKit, won't send
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="schedule" id="newsletter-schedule" className="peer sr-only" />
                    <Label 
                      htmlFor="newsletter-schedule" 
                      className="flex items-start gap-3 p-4 rounded-lg border-2 bg-background cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/10 transition-colors"
                    >
                      <CalendarClock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Schedule Send</div>
                        <div className="text-sm text-muted-foreground">
                          Set specific date/time to send to subscribers
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="send_now" id="newsletter-send" className="peer sr-only" />
                    <Label 
                      htmlFor="newsletter-send" 
                      className="flex items-start gap-3 p-4 rounded-lg border-2 bg-background cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/10 transition-colors"
                    >
                      <Send className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Send Now</div>
                        <div className="text-sm text-muted-foreground">
                          Creates and sends newsletter immediately
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {newsletterAction === 'schedule' && (
                  <div className="space-y-3 pl-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="newsletter-schedule-time" className="text-sm font-medium">
                      Select Date & Time
                    </Label>
                    <Input
                      id="newsletter-schedule-time"
                      type="datetime-local"
                      value={newsletterScheduleTime}
                      onChange={(e) => setNewsletterScheduleTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="max-w-sm"
                    />
                    {newsletterScheduleTime && (
                      <p className="text-sm text-muted-foreground">
                        Will send on {new Date(newsletterScheduleTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePublish} 
              className="flex-1"
              disabled={!webEnabled && !newsletterEnabled}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {getButtonText()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
