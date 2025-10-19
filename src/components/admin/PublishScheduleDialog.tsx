import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Zap, 
  Mail, 
  Send, 
  CalendarClock, 
  CheckCircle,
  Link2,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ScheduleData {
  publishNow: boolean;
  publishAt: string | null;
  sendNewsletter: boolean;
  newsletterMode: 'draft' | 'schedule' | 'send_now';
  sendAt: string | null;
}

interface PublishScheduleDialogProps {
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
  onSchedule: (data: ScheduleData) => void;
}

export const PublishScheduleDialog = ({
  open,
  onOpenChange,
  post,
  onSchedule,
}: PublishScheduleDialogProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    publishNow: post.published,
    publishAt: post.published_at || null,
    sendNewsletter: false,
    newsletterMode: 'draft',
    sendAt: null,
  });

  const handleConfirm = () => {
    onSchedule(scheduleData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish & Newsletter</DialogTitle>
          <DialogDescription>
            Configure when to publish "{post.title}" and send to ConvertKit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* POST PUBLISHING SECTION */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              📝 Post Publishing
            </h3>
            
            <RadioGroup 
              value={scheduleData.publishNow ? 'now' : 'scheduled'}
              onValueChange={(v) => setScheduleData({
                ...scheduleData,
                publishNow: v === 'now',
                publishAt: v === 'now' ? null : scheduleData.publishAt
              })}
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="now" id="publish-now" />
                <Label htmlFor="publish-now" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span>Publish immediately</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="scheduled" id="publish-scheduled" />
                <Label htmlFor="publish-scheduled" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Schedule for later</span>
                </Label>
              </div>
            </RadioGroup>

            {!scheduleData.publishNow && (
              <div className="ml-6 space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="publish-date">Publish Date & Time</Label>
                <Input
                  id="publish-date"
                  type="datetime-local"
                  value={scheduleData.publishAt || ''}
                  onChange={(e) => setScheduleData({ 
                    ...scheduleData, 
                    publishAt: e.target.value 
                  })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* NEWSLETTER SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                📧 Newsletter (ConvertKit V4)
              </h3>
              <Switch
                checked={scheduleData.sendNewsletter}
                onCheckedChange={(checked) => 
                  setScheduleData({ ...scheduleData, sendNewsletter: checked })
                }
              />
            </div>

            {/* Show Kit Status if already sent */}
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

            {scheduleData.sendNewsletter && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <RadioGroup 
                  value={scheduleData.newsletterMode}
                  onValueChange={(v) => setScheduleData({
                    ...scheduleData,
                    newsletterMode: v as any
                  })}
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="draft" id="kit-draft" />
                    <Label htmlFor="kit-draft" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium">Save as Draft in Kit</div>
                          <div className="text-xs text-muted-foreground">
                            Creates draft broadcast, won't send
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="schedule" id="kit-schedule" />
                    <Label htmlFor="kit-schedule" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-medium">Schedule Send</div>
                          <div className="text-xs text-muted-foreground">
                            Set specific date/time to send
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="send_now" id="kit-send-now" />
                    <Label htmlFor="kit-send-now" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium">Send Immediately</div>
                          <div className="text-xs text-muted-foreground">
                            Creates and sends right away
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {scheduleData.newsletterMode === 'schedule' && (
                  <div className="ml-6 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="send-date">Newsletter Send Date & Time</Label>
                    <Input
                      id="send-date"
                      type="datetime-local"
                      value={scheduleData.sendAt || ''}
                      onChange={(e) => setScheduleData({ 
                        ...scheduleData, 
                        sendAt: e.target.value 
                      })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    {scheduleData.newsletterMode === 'draft' && (
                      'Draft will be created in ConvertKit but not published.'
                    )}
                    {scheduleData.newsletterMode === 'schedule' && (
                      'Broadcast will be scheduled in ConvertKit for the selected time.'
                    )}
                    {scheduleData.newsletterMode === 'send_now' && (
                      'Broadcast will be created and sent immediately to all subscribers.'
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
