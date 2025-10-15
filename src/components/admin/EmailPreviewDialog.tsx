import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Smartphone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogPost: {
    title: string;
    excerpt?: string;
    content?: string;
    cover_image_url?: string;
    slug: string;
    author: string;
    published_at?: string;
  };
}

export const EmailPreviewDialog = ({ open, onOpenChange, blogPost }: EmailPreviewDialogProps) => {
  const [testEmail, setTestEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-blog-newsletter", {
        body: {
          to: testEmail,
          blogPost: {
            ...blogPost,
            published_at: blogPost.published_at || new Date().toISOString(),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent!",
        description: `Preview email sent to ${testEmail}`,
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Failed to Send",
        description: "Could not send test email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const EmailContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`mx-auto bg-background border rounded-lg overflow-hidden ${
        isMobile ? "max-w-[375px]" : "max-w-[600px]"
      }`}
    >
      {/* Header */}
      <div className="bg-primary p-6 text-primary-foreground">
        <h1 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>
          New Blog Post from Sergio Avedian
        </h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {blogPost.cover_image_url && (
          <img
            src={blogPost.cover_image_url}
            alt={blogPost.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <h2 className={`font-bold mb-3 ${isMobile ? "text-lg" : "text-2xl"}`}>
          {blogPost.title}
        </h2>

        {blogPost.excerpt && (
          <p className={`text-muted-foreground mb-4 ${isMobile ? "text-sm" : "text-base"}`}>
            {blogPost.excerpt}
          </p>
        )}

        <div className="mb-6">
          <p className={`text-sm text-muted-foreground mb-2`}>
            By {blogPost.author} • {new Date(blogPost.published_at || new Date()).toLocaleDateString()}
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={`https://yourdomain.com/blog/${blogPost.slug}`}
          className="inline-block w-full text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Read Full Article
        </a>
      </div>

      {/* Footer */}
      <div className="bg-muted p-6 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          You're receiving this because you subscribed to Sergio Avedian's newsletter
        </p>
        <a href="#" className="text-xs text-primary hover:underline">
          Unsubscribe
        </a>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Preview - {blogPost.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Test Email Section */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="test-email">Send Test Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleSendTestEmail} disabled={isSending}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send Test"}
            </Button>
          </div>

          {/* Preview Tabs */}
          <Tabs defaultValue="desktop" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="desktop">
                <Monitor className="w-4 h-4 mr-2" />
                Desktop View
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desktop" className="mt-4">
              <div className="bg-muted/30 p-6 rounded-lg">
                <EmailContent />
              </div>
            </TabsContent>
            <TabsContent value="mobile" className="mt-4">
              <div className="bg-muted/30 p-6 rounded-lg flex justify-center">
                <EmailContent isMobile />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
