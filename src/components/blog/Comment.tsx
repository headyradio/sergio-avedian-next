import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { BlogComment } from '@/hooks/useComments';
import { CommentForm } from './CommentForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommentProps {
  comment: BlogComment;
  onLike: (commentId: string) => void;
  onReply: (data: any) => void;
  onReport: (data: { commentId: string; reporterEmail: string; reason: string }) => void;
  isSubmitting?: boolean;
}

export const Comment = ({ comment, onLike, onReply, onReport, isSubmitting }: CommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporterEmail, setReporterEmail] = useState('');
  const [reportReason, setReportReason] = useState('');

  const handleReplySubmit = (data: any) => {
    onReply(data);
    setShowReplyForm(false);
  };

  const handleReport = () => {
    onReport({
      commentId: comment.id,
      reporterEmail,
      reason: reportReason
    });
    setShowReportDialog(false);
    setReporterEmail('');
    setReportReason('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {comment.author_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author_name}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className="gap-1"
            >
              <Heart className="h-4 w-4" />
              <span>{comment.likes_count || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Reply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportDialog(true)}
              className="gap-1"
            >
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>

          {showReplyForm && (
            <div className="mt-4 pl-4 border-l-2 border-border">
              <CommentForm
                postId={comment.post_id}
                parentCommentId={comment.id}
                onSubmit={handleReplySubmit}
                isSubmitting={isSubmitting}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4 pl-4 border-l-2 border-border">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onReport={onReport}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
            <DialogDescription>
              Help us maintain a safe and respectful community. Please provide details about why you're reporting this comment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reporter-email">Your Email</Label>
              <Input
                id="reporter-email"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason</Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please describe why you're reporting this comment..."
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReport}
              disabled={!reporterEmail || !reportReason}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
