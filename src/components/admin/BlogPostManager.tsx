import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmailPreviewDialog } from './EmailPreviewDialog';
import { PublishScheduleDialog } from './PublishScheduleDialog';
import { PublishOptionsDialog } from './PublishOptionsDialog';
import EmailTestDialog from './EmailTestDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Edit, Plus, Mail, Calendar, CheckCircle2, Clock, AlertCircle, ChevronDown, Eye } from 'lucide-react';
import { 
  useBlogPosts, 
  useCategories, 
  useCreateBlogPost, 
  useUpdateBlogPost, 
  useDeleteBlogPost, 
  useNewsletterQueue,
  useSendNewsletterNow,
  useQueueNewsletter,
  CMSBlogPost 
} from '@/hooks/useSupabaseCMS';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BlogPostManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [emailPreviewPost, setEmailPreviewPost] = useState<CMSBlogPost | null>(null);
  const [scheduleDialogPost, setScheduleDialogPost] = useState<CMSBlogPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [emailTestDialogPost, setEmailTestDialogPost] = useState<CMSBlogPost | null>(null);
  const [showBlogPreview, setShowBlogPreview] = useState(false);

  const { data: blogPosts, isLoading } = useBlogPosts(50, 0, false);
  const { data: categories } = useCategories();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const sendNewsletterNow = useSendNewsletterNow();
  const queueNewsletter = useQueueNewsletter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category_id: '',
    featured: false,
    published: false,
    published_at: '',
    read_time: '',
    seo_title: '',
    seo_description: '',
    cover_image_url: '',
    cover_image_alt: '',
    // Newsletter fields
    newsletter_subject: '',
    newsletter_content: '',
    newsletter_preview_text: '',
    email_template_id: '4692916',
  });

  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPublished = showPublishedOnly ? post.published : true;
    return matchesSearch && matchesPublished;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      await updateBlogPost.mutateAsync({ id: editingPost.id, ...formData });
    } else {
      await createBlogPost.mutateAsync(formData);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (post: CMSBlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author,
      category_id: post.category_id || '',
      featured: post.featured,
      published: post.published,
      published_at: post.published_at || '',
      read_time: post.read_time || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      cover_image_url: post.cover_image_url || '',
      cover_image_alt: post.cover_image_alt || '',
      // Newsletter fields
      newsletter_subject: post.newsletter_subject || '',
      newsletter_content: post.newsletter_content || '',
      newsletter_preview_text: post.newsletter_preview_text || '',
      email_template_id: post.email_template_id || '4692916',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category_id: '',
      featured: false,
      published: false,
      published_at: '',
      read_time: '',
      seo_title: '',
      seo_description: '',
      cover_image_url: '',
      cover_image_alt: '',
      // Newsletter fields
      newsletter_subject: '',
      newsletter_content: '',
      newsletter_preview_text: '',
      email_template_id: '4692916',
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const handleBulkSendNewsletter = () => {
    const selectedPostsList = blogPosts?.filter(p => selectedPosts.has(p.id));
    if (selectedPostsList && selectedPostsList.length > 0) {
      // For bulk, we'll send the first one through schedule dialog
      // In a real implementation, you'd handle multiple posts
      setScheduleDialogPost(selectedPostsList[0]);
    }
  };

  const handleSendNewsletter = (post: CMSBlogPost) => {
    setEmailTestDialogPost(post);
  };

  const handleConfirmSendNewsletter = async () => {
    if (!emailTestDialogPost) return;
    await sendNewsletterNow.mutateAsync({
      postId: emailTestDialogPost.id,
      mode: 'send_now',
      sendAt: new Date().toISOString(),
    });
  };

  const NewsletterBadge = ({ postId }: { postId: string }) => {
    const { data: queue } = useNewsletterQueue(postId);
    
    if (!queue || !Array.isArray(queue) || queue.length === 0) return null;
    
    const latestQueue = queue[0];
    
    if (latestQueue.status === 'pending') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Scheduled {new Date(latestQueue.scheduled_for).toLocaleDateString()}
        </Badge>
      );
    }
    
    if (latestQueue.status === 'sending') {
      return (
        <Badge variant="default" className="flex items-center gap-1 animate-pulse">
          <Mail className="w-3 h-3" />
          Sending
        </Badge>
      );
    }
    
    if (latestQueue.status === 'sent') {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle2 className="w-3 h-3" />
          Sent
        </Badge>
      );
    }
    
    if (latestQueue.status === 'failed') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Failed
        </Badge>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return <div>Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="published-only"
              checked={showPublishedOnly}
              onCheckedChange={setShowPublishedOnly}
            />
            <Label htmlFor="published-only">Published only</Label>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                          const filePath = `blog-covers/${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('cms-media')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const { data: { publicUrl } } = supabase.storage
                            .from('cms-media')
                            .getPublicUrl(filePath);

                          setFormData({ ...formData, cover_image_url: publicUrl });
                          toast.success('Image uploaded successfully');
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('Failed to upload image');
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                      disabled={!formData.cover_image_url}
                    >
                      Clear
                    </Button>
                  </div>
                  {formData.cover_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.cover_image_url} 
                        alt="Cover preview" 
                        className="max-h-40 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover-image-alt">Cover Image Alt Text</Label>
                  <Input
                    id="cover-image-alt"
                    value={formData.cover_image_alt}
                    onChange={(e) => setFormData({ ...formData, cover_image_alt: e.target.value })}
                    placeholder="Description of the image"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog post content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read-time">Read Time</Label>
                  <Input
                    id="read-time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea
                  id="seo-description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>
              </div>

              {/* Newsletter Composer Section */}
              <Collapsible className="border rounded-lg p-4 space-y-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    📧 Newsletter Composer (Optional)
                  </h3>
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-subject">Email Subject Line</Label>
                      <Input
                        id="newsletter-subject"
                        value={formData.newsletter_subject || ''}
                        onChange={(e) => setFormData({ ...formData, newsletter_subject: e.target.value })}
                        placeholder={formData.title || 'Subject line (defaults to post title)'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to use post title
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-preview">Email Preview Text</Label>
                      <Input
                        id="newsletter-preview"
                        value={formData.newsletter_preview_text || ''}
                        onChange={(e) => setFormData({ ...formData, newsletter_preview_text: e.target.value })}
                        placeholder="Shows in inbox preview..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional preview text shown in email clients
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsletter-content">Email Content (HTML)</Label>
                    <Textarea
                      id="newsletter-content"
                      value={formData.newsletter_content || ''}
                      onChange={(e) => setFormData({ ...formData, newsletter_content: e.target.value })}
                      placeholder="Leave blank to auto-generate from blog post content..."
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom HTML for email. Leave blank to auto-generate from post content.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-template-id">ConvertKit Template ID</Label>
                      <Input
                        id="email-template-id"
                        value={formData.email_template_id || '4692916'}
                        onChange={(e) => setFormData({ ...formData, email_template_id: e.target.value })}
                        placeholder="4692916"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your ConvertKit email template ID
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Subscriber Filter</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="all-subscribers"
                          checked={true}
                          disabled
                        />
                        <Label htmlFor="all-subscribers" className="text-sm">
                          Send to all subscribers
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Currently sends to all subscribers
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmailPreviewPost({
                        title: formData.title,
                        excerpt: formData.excerpt,
                        content: formData.content,
                        cover_image_url: formData.cover_image_url,
                        slug: formData.slug,
                        author: formData.author,
                        published_at: formData.published ? new Date().toISOString() : undefined,
                      } as CMSBlogPost);
                    }}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Preview & Test Email
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (!editingPost?.id) {
                      toast.error('Please save the post first before previewing');
                      return;
                    }
                    const previewUrl = `/admin/blog-preview/${editingPost.id}`;
                    window.open(previewUrl, '_blank', 'width=1200,height=900');
                  }}
                  disabled={!formData.title || !editingPost}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button type="submit" disabled={createBlogPost.isPending || updateBlogPost.isPending} variant="outline">
                  {editingPost ? 'Save' : 'Save'} Draft
                </Button>
                {editingPost && (
                  <Button 
                    type="button"
                    onClick={() => setScheduleDialogPost(editingPost)}
                    disabled={createBlogPost.isPending || updateBlogPost.isPending}
                  >
                    Publish
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredPosts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedPosts.has(post.id)}
                    onCheckedChange={() => togglePostSelection(post.id)}
                  />
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {post.featured && <Badge variant="secondary">Featured</Badge>}
                  <Badge variant={post.published ? "default" : "outline"}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                  {!post.published && post.published_at && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Scheduled: {new Date(post.published_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Badge>
                  )}
                  <NewsletterBadge postId={post.id} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setScheduleDialogPost(post)}
                    title="Schedule or send newsletter"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  {post.published && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSendNewsletter(post)}
                      title="Send newsletter now"
                    >
                      <Mail className="w-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBlogPost.mutate(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  By {post.author} • {post.category?.name} • {post.read_time || 'Unknown read time'}
                </div>
                <div>
                  {post.published_at ? `Published: ${new Date(post.published_at).toLocaleDateString()}` : `Created: ${new Date(post.created_at).toLocaleDateString()}`}
                </div>
              </div>
              {post.excerpt && (
                <p className="mt-2 text-sm">{post.excerpt}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPosts.size > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center space-x-4">
          <span>{selectedPosts.size} posts selected</span>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleBulkSendNewsletter}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedPosts(new Set())}
          >
            Cancel
          </Button>
        </div>
      )}

      {emailPreviewPost && (
        <EmailPreviewDialog
          open={!!emailPreviewPost}
          onOpenChange={(open) => !open && setEmailPreviewPost(null)}
          blogPost={emailPreviewPost}
        />
      )}

      {false && scheduleDialogPost && (
        <PublishScheduleDialog
          open={!!scheduleDialogPost}
          onOpenChange={(open) => !open && setScheduleDialogPost(null)}
          post={scheduleDialogPost}
          onSchedule={async (data) => {
            try {
              // Determine publish date
              const publishDate = data.publishNow 
                ? new Date().toISOString() 
                : data.publishAt;

              // Update post with published status and date
              await updateBlogPost.mutateAsync({
                id: scheduleDialogPost.id,
                published: data.publishNow,
                published_at: publishDate,
              });

              // Handle newsletter if enabled
              if (data.sendNewsletter) {
                let sendAt: string | null = null;
                
                if (data.newsletterMode === 'send_now') {
                  sendAt = new Date().toISOString();
                } else if (data.newsletterMode === 'schedule' && data.sendAt) {
                  sendAt = data.sendAt;
                }
                
                await sendNewsletterNow.mutateAsync({
                  postId: scheduleDialogPost.id,
                  mode: data.newsletterMode,
                  sendAt: sendAt,
                });
              }

              setScheduleDialogPost(null);
            } catch (error) {
              console.error('Failed to schedule post:', error);
            }
          }}
        />
      )}

      {emailTestDialogPost && (
        <EmailTestDialog
          open={!!emailTestDialogPost}
          onOpenChange={(open) => !open && setEmailTestDialogPost(null)}
          post={emailTestDialogPost}
          onConfirmSend={handleConfirmSendNewsletter}
        />
      )}

      {/* Publish Options Dialog */}
      {scheduleDialogPost && (
        <PublishOptionsDialog
          open={!!scheduleDialogPost}
          onOpenChange={(open) => !open && setScheduleDialogPost(null)}
          post={{
            id: scheduleDialogPost.id,
            title: scheduleDialogPost.title,
            published: scheduleDialogPost.published,
            published_at: scheduleDialogPost.published_at,
            sent_to_kit: scheduleDialogPost.sent_to_kit,
            kit_status: scheduleDialogPost.kit_status,
            kit_broadcast_id: scheduleDialogPost.kit_broadcast_id,
          }}
          onPublish={async (data) => {
            try {
              if (data.target === 'web' || data.target === 'both') {
                const updateData: any = {
                  published: data.webAction === 'now',
                  published_at: data.webAction === 'schedule' ? data.webScheduleTime : new Date().toISOString(),
                };

                const { error } = await supabase
                  .from('cms_blog_posts')
                  .update(updateData)
                  .eq('id', scheduleDialogPost.id);

                if (error) throw error;
              }

              if (data.target === 'newsletter' || data.target === 'both') {
                const newsletterData = {
                  post_id: scheduleDialogPost.id,
                  mode: data.newsletterAction,
                  scheduled_for: data.newsletterAction === 'schedule' ? data.newsletterScheduleTime : undefined,
                };

                const { error: newsletterError } = await supabase.functions.invoke('send-blog-newsletter', {
                  body: newsletterData,
                });

                if (newsletterError) throw newsletterError;
              }

              toast.success(
                data.target === 'both' 
                  ? "Post published to web and newsletter queued"
                  : data.target === 'web'
                  ? data.webAction === 'now' ? "Post published" : "Post scheduled"
                  : "Newsletter queued"
              );

              setScheduleDialogPost(null);
              setIsDialogOpen(false);
              setEditingPost(null);
            } catch (error: any) {
              console.error('Publish error:', error);
              toast.error(`Failed to publish: ${error.message}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default BlogPostManager;
