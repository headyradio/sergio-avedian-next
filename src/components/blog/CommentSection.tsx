import { MessageCircle } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { CommentForm } from './CommentForm';
import { Comment } from './Comment';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { 
    comments, 
    isLoading, 
    submitComment, 
    isSubmitting,
    likeComment,
    reportComment 
  } = useComments(postId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        <h2 className="text-2xl font-bold">
          {comments.length === 0 
            ? 'Be the first to comment' 
            : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`
          }
        </h2>
      </div>

      {/* Comment Form */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
        <CommentForm
          postId={postId}
          onSubmit={submitComment}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border rounded-lg p-6">
              <Comment
                comment={comment}
                onLike={likeComment}
                onReply={submitComment}
                onReport={reportComment}
                isSubmitting={isSubmitting}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
