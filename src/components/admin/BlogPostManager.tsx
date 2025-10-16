import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmailPreviewDialog } from './EmailPreviewDialog';
import { PublishScheduleDialog } from './PublishScheduleDialog';
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
import { Trash2, Edit, Plus, Mail, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { 
  useBlogPosts, 
  useCategories, 
  useCreateBlogPost, 
  useUpdateBlogPost, 
  useDeleteBlogPost, 
  useNewsletterQueue,
  useSendNewsletterNow,
  CMSBlogPost 
} from '@/hooks/useSupabaseCMS';
import RichTextEditor from '@/components/ui/rich-text-editor';

const BlogPostManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [emailPreviewPost, setEmailPreviewPost] = useState<CMSBlogPost | null>(null);
  const [scheduleDialogPost, setScheduleDialogPost] = useState<CMSBlogPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [emailTestDialogPost, setEmailTestDialogPost] = useState<CMSBlogPost | null>(null);

  const { data: blogPosts, isLoading } = useBlogPosts(50, 0, false);
  const { data: categories } = useCategories();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const sendNewsletterNow = useSendNewsletterNow();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category_id: '',
    featured: false,
    published: false,
    read_time: '',
    seo_title: '',
    seo_description: '',
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
      read_time: post.read_time || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
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
      read_time: '',
      seo_title: '',
      seo_description: '',
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
    await sendNewsletterNow.mutateAsync(emailTestDialogPost.id);
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

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBlogPost.isPending || updateBlogPost.isPending}>
                  {editingPost ? 'Update' : 'Create'} Post
                </Button>
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

      {scheduleDialogPost && (
        <PublishScheduleDialog
          open={!!scheduleDialogPost}
          onOpenChange={(open) => !open && setScheduleDialogPost(null)}
          post={scheduleDialogPost}
          onSchedule={async (data) => {
            // Handle scheduling logic here
            console.log('Schedule data:', data);
            setScheduleDialogPost(null);
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
    </div>
  );
};

export default BlogPostManager;
