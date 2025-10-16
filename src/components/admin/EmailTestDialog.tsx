import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CMSBlogPost } from '@/hooks/useSupabaseCMS';
import { EmailPreviewDialog } from './EmailPreviewDialog';

interface EmailTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: CMSBlogPost;
  onConfirmSend: () => void;
}

const EmailTestDialog = ({ open, onOpenChange, post, onConfirmSend }: EmailTestDialogProps) => {
  const [testEmail, setTestEmail] = useState('');
  const [testSent, setTestSent] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingTest(true);
    try {
      console.log('Sending test email to:', testEmail, 'for post:', post.title);
      
      const { data, error } = await supabase.functions.invoke('send-blog-newsletter', {
        body: {
          blogPost: {
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            author: post.author,
            cover_image_url: post.cover_image_url,
            slug: post.slug,
            published_at: post.published_at,
          },
          to: testEmail,
        },
      });

      console.log('Test email response:', data);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      setTestSent(true);
      toast({
        title: 'Test Email Sent!',
        description: `Check ${testEmail} for the test newsletter`,
      });
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Failed to Send Test',
        description: error.message || 'Could not send test email. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleConfirmSend = () => {
    if (!testSent || !confirmationChecked) {
      toast({
        title: 'Review Required',
        description: 'Please send a test email and confirm before sending to all subscribers',
        variant: 'destructive',
      });
      return;
    }

    onConfirmSend();
    onOpenChange(false);
    
    // Reset state
    setTestEmail('');
    setTestSent(false);
    setConfirmationChecked(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state on close
    setTestEmail('');
    setTestSent(false);
    setConfirmationChecked(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Newsletter: {post.title}
            </DialogTitle>
            <DialogDescription>
              Send a test email first to review the newsletter before sending to all subscribers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Test Email Section */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Step 1: Send Test Email</h4>
                {testSent && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="test-email" className="sr-only">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    disabled={isSendingTest}
                  />
                </div>
                <Button 
                  onClick={handleSendTest} 
                  disabled={isSendingTest || !testEmail}
                  variant="outline"
                >
                  {isSendingTest ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </>
                  )}
                </Button>
              </div>

              {testSent && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Test email sent successfully! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Preview Section */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPreview(true)}
              >
                Preview Email Content
              </Button>
            </div>

            {/* Confirmation Section */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="font-medium text-sm">Step 2: Confirm & Send to All</h4>
              
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  This will send the newsletter to ALL subscribers. This action cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confirm-send"
                  checked={confirmationChecked}
                  onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
                  disabled={!testSent}
                />
                <Label 
                  htmlFor="confirm-send" 
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I have reviewed the test email and confirm that I want to send this newsletter to all subscribers
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSend}
              disabled={!testSent || !confirmationChecked}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to All Subscribers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmailPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        blogPost={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          cover_image_url: post.cover_image_url,
          slug: post.slug,
          author: post.author,
          published_at: post.published_at,
        }}
      />
    </>
  );
};

export default EmailTestDialog;
