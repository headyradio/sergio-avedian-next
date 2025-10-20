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
  const [webEnabled, setWebEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [webAction, setWebAction] = useState<'now' | 'schedule'>(post.published ? 'now' : 'now');
  const [webScheduleTime, setWebScheduleTime] = useState(post.published_at || '');
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
          <div className="space-y-4 pb-4 border-b">
            <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer" onClick={() => setWebEnabled(!webEnabled)}>
              <Checkbox 
                id="web-toggle" 
                checked={webEnabled} 
                onCheckedChange={(checked) => setWebEnabled(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="web-toggle" className="flex-1 cursor-pointer">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold text-base">Publish to web</div>
                    <div className="text-sm text-muted-foreground">
                      Make your post live on the website
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer" onClick={() => setNewsletterEnabled(!newsletterEnabled)}>
              <Checkbox 
                id="newsletter-toggle" 
                checked={newsletterEnabled} 
                onCheckedChange={(checked) => setNewsletterEnabled(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="newsletter-toggle" className="flex-1 cursor-pointer">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold text-base">Send email</div>
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
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Web Publishing</h3>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Publish to your website to make it publicly visible
                </AlertDescription>
              </Alert>

              <RadioGroup value={webAction} onValueChange={(v) => setWebAction(v as any)}>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <RadioGroupItem value="now" id="web-now" />
                  <Label htmlFor="web-now" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-base">Publish Now</div>
                        <div className="text-sm text-muted-foreground">
                          Make live on website immediately
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <RadioGroupItem value="schedule" id="web-schedule" />
                  <Label htmlFor="web-schedule" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-base">Schedule</div>
                        <div className="text-sm text-muted-foreground">
                          Set a specific date and time to publish
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {webAction === 'schedule' && (
                <div className="space-y-2 pl-4 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="web-schedule-time" className="text-base">
                    Select Date & Time
                  </Label>
                  <Input
                    id="web-schedule-time"
                    type="datetime-local"
                    value={webScheduleTime}
                    onChange={(e) => setWebScheduleTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="text-base"
                  />
                  {webScheduleTime && (
                    <p className="text-sm text-muted-foreground">
                      Will publish on {new Date(webScheduleTime).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* NEWSLETTER SECTION */}
          {newsletterEnabled && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Newsletter</h3>
              </div>

              {post.sent_to_kit && (
                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <strong>ConvertKit Status:</strong>{' '}
                      <Badge variant="outline" className="ml-2">
                        {post.kit_status || 'sent'}
                      </Badge>
                    </div>
                    {post.kit_broadcast_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://app.convertkit.com/broadcasts/${post.kit_broadcast_id}`, '_blank')}
                      >
                        View in Kit <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Send your blog post to subscribers via ConvertKit
                </AlertDescription>
              </Alert>

              <RadioGroup value={newsletterAction} onValueChange={(v) => setNewsletterAction(v as any)}>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <RadioGroupItem value="draft" id="newsletter-draft" />
                  <Label htmlFor="newsletter-draft" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-base">Save as Draft</div>
                        <div className="text-sm text-muted-foreground">
                          Creates draft in ConvertKit, won't send
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <RadioGroupItem value="schedule" id="newsletter-schedule" />
                  <Label htmlFor="newsletter-schedule" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <CalendarClock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-base">Schedule Send</div>
                        <div className="text-sm text-muted-foreground">
                          Set specific date/time to send to subscribers
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                  <RadioGroupItem value="send_now" id="newsletter-send" />
                  <Label htmlFor="newsletter-send" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Send className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-base">Send Now</div>
                        <div className="text-sm text-muted-foreground">
                          Creates and sends newsletter immediately
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {newsletterAction === 'schedule' && (
                <div className="space-y-2 pl-4 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="newsletter-schedule-time" className="text-base">
                    Select Date & Time
                  </Label>
                  <Input
                    id="newsletter-schedule-time"
                    type="datetime-local"
                    value={newsletterScheduleTime}
                    onChange={(e) => setNewsletterScheduleTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="text-base"
                  />
                  {newsletterScheduleTime && (
                    <p className="text-sm text-muted-foreground">
                      Will send on {new Date(newsletterScheduleTime).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
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
