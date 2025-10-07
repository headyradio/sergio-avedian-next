import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSubmit: (data: {
    postId: string;
    authorName: string;
    authorEmail: string;
    content: string;
    parentCommentId?: string;
    honeypot?: string;
    timeToSubmit: number;
  }) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const CommentForm = ({ 
  postId, 
  parentCommentId, 
  onSubmit, 
  isSubmitting,
  onCancel 
}: CommentFormProps) => {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [startTime] = useState(Date.now());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const timeToSubmit = Math.floor((Date.now() - startTime) / 1000);
    
    onSubmit({
      postId,
      authorName,
      authorEmail,
      content,
      parentCommentId,
      honeypot,
      timeToSubmit
    });

    // Reset form
    setAuthorName('');
    setAuthorEmail('');
    setContent('');
  };

  const charCount = content.length;
  const maxChars = 2000;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field - hidden from users */}
      <div className="hidden">
        <Input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            maxLength={100}
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            maxLength={255}
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">
          Comment * 
          <span className="text-sm text-muted-foreground ml-2">
            {charCount}/{maxChars}
          </span>
        </Label>
        <Textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={maxChars}
          placeholder="Share your thoughts..."
          className="min-h-[120px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting || !authorName || !authorEmail || !content}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            parentCommentId ? 'Post Reply' : 'Post Comment'
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Your email will not be published. All comments are moderated before appearing.
      </p>
    </form>
  );
};
