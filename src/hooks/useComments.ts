import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  parent_comment_id: string | null;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  created_at: string;
  updated_at: string;
  likes_count?: number;
  user_liked?: boolean;
  replies?: BlogComment[];
}

export interface CommentSubmission {
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  parentCommentId?: string;
  honeypot?: string;
  timeToSubmit?: number;
}

export const useComments = (postId: string) => {
  const queryClient = useQueryClient();

  // Fetch approved comments for a blog post
  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blog_comment_likes(count)
        `)
        .eq('post_id', postId)
        .eq('status', 'approved')
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('parent_comment_id', comment.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: true });

          return {
            ...comment,
            likes_count: comment.blog_comment_likes?.[0]?.count || 0,
            replies: replies || []
          };
        })
      );

      return commentsWithReplies as BlogComment[];
    },
    enabled: !!postId
  });

  // Submit a new comment
  const submitComment = useMutation({
    mutationFn: async (submission: CommentSubmission) => {
      const { data, error } = await supabase.functions.invoke('submit-blog-comment', {
        body: submission
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
      
      if (data.comment?.status === 'pending') {
        toast.success('Your comment is awaiting moderation');
      } else if (data.comment?.status === 'approved') {
        toast.success('Comment posted successfully!');
      }
    },
    onError: (error: Error) => {
      console.error('Error submitting comment:', error);
      toast.error(error.message || 'Failed to submit comment');
    }
  });

  // Like a comment
  const likeComment = useMutation({
    mutationFn: async (commentId: string) => {
      const ipAddress = 'unknown'; // In production, this would come from the client

      const { error } = await supabase
        .from('blog_comment_likes')
        .insert({
          comment_id: commentId,
          ip_address: ipAddress
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
      toast.success('Comment liked!');
    },
    onError: (error: Error) => {
      console.error('Error liking comment:', error);
      if (error.message.includes('duplicate')) {
        toast.error('You already liked this comment');
      } else {
        toast.error('Failed to like comment');
      }
    }
  });

  // Report a comment
  const reportComment = useMutation({
    mutationFn: async ({ commentId, reporterEmail, reason }: { 
      commentId: string; 
      reporterEmail: string; 
      reason: string;
    }) => {
      const { error } = await supabase
        .from('blog_comment_reports')
        .insert({
          comment_id: commentId,
          reporter_email: reporterEmail,
          reason
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Comment reported. Thank you for helping us maintain a safe community.');
    },
    onError: (error: Error) => {
      console.error('Error reporting comment:', error);
      toast.error('Failed to report comment');
    }
  });

  return {
    comments,
    isLoading,
    error,
    submitComment: submitComment.mutate,
    isSubmitting: submitComment.isPending,
    likeComment: likeComment.mutate,
    reportComment: reportComment.mutate
  };
};
