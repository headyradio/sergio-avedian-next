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
} from "lucide-react";

interface ScheduleData {
  publishNow: boolean;
  publishAt: string | null;
  sendNewsletter: boolean;
  sendTiming: 'immediately' | 'with_post' | 'custom';
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
    sendTiming: 'with_post',
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
          <DialogTitle>Scheduling</DialogTitle>
          <DialogDescription>
            Configure when to publish "{post.title}" and send newsletter
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
                📧 Newsletter
              </h3>
              <Switch
                checked={scheduleData.sendNewsletter}
                onCheckedChange={(checked) => 
                  setScheduleData({ ...scheduleData, sendNewsletter: checked })
                }
              />
            </div>

            {scheduleData.sendNewsletter && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <RadioGroup 
                  value={scheduleData.sendTiming}
                  onValueChange={(v) => setScheduleData({
                    ...scheduleData,
                    sendTiming: v as any
                  })}
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="immediately" id="send-now" />
                    <Label htmlFor="send-now" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Send className="w-4 h-4 text-green-600" />
                      <span>Send immediately</span>
                      {!scheduleData.publishNow && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Before post publishes
                        </Badge>
                      )}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="with_post" id="send-with-post" />
                    <Label htmlFor="send-with-post" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Link2 className="w-4 h-4 text-blue-600" />
                      <span>Send when post publishes</span>
                      {scheduleData.publishAt && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({new Date(scheduleData.publishAt).toLocaleString()})
                        </span>
                      )}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="custom" id="send-custom" />
                    <Label htmlFor="send-custom" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CalendarClock className="w-4 h-4 text-purple-600" />
                      <span>Custom schedule</span>
                    </Label>
                  </div>
                </RadioGroup>

                {scheduleData.sendTiming === 'custom' && (
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
                    Newsletter will be sent to your active subscribers using your ConvertKit template.
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
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
