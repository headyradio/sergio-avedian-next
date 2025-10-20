import { useState } from 'react';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor, CMSAuthor } from '@/hooks/useSupabaseCMS';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthorsManager = () => {
  const { data: authors, isLoading } = useAuthors();
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();
  const deleteAuthor = useDeleteAuthor();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<CMSAuthor | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<CMSAuthor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    position: '',
    bio: '',
    avatar_url: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    website: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      email: '',
      position: '',
      bio: '',
      avatar_url: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      website: '',
    });
    setEditingAuthor(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingAuthor ? prev.slug : generateSlug(name),
    }));
  };

  const handleOpenDialog = (author?: CMSAuthor) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name,
        slug: author.slug,
        email: author.email || '',
        position: author.position || '',
        bio: author.bio || '',
        avatar_url: author.avatar_url || '',
        twitter: author.social_links?.twitter || '',
        linkedin: author.social_links?.linkedin || '',
        youtube: author.social_links?.youtube || '',
        website: author.social_links?.website || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveAuthor = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Name and slug are required');
      return;
    }

    const authorData = {
      name: formData.name,
      slug: formData.slug,
      email: formData.email || null,
      position: formData.position || null,
      bio: formData.bio || null,
      avatar_url: formData.avatar_url || null,
      social_links: {
        twitter: formData.twitter || undefined,
        linkedin: formData.linkedin || undefined,
        youtube: formData.youtube || undefined,
        website: formData.website || undefined,
      },
    };

    try {
      if (editingAuthor) {
        await updateAuthor.mutateAsync({ id: editingAuthor.id, ...authorData });
        toast.success('Author updated successfully');
      } else {
        await createAuthor.mutateAsync(authorData);
        toast.success('Author created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save author');
      console.error(error);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!deletingAuthor) return;

    try {
      await deleteAuthor.mutateAsync(deletingAuthor.id);
      toast.success('Author deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingAuthor(null);
    } catch (error) {
      toast.error('Failed to delete author');
      console.error(error);
    }
  };

  const filteredAuthors = authors?.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Author
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Social Links</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAuthors && filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={author.avatar_url || ''} alt={author.name} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{author.name}</div>
                        <div className="text-sm text-muted-foreground">/{author.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{author.position || '—'}</TableCell>
                  <TableCell>{author.email || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {author.social_links?.twitter && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Twitter</span>
                      )}
                      {author.social_links?.linkedin && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">LinkedIn</span>
                      )}
                      {author.social_links?.youtube && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">YouTube</span>
                      )}
                      {!author.social_links?.twitter &&
                        !author.social_links?.linkedin &&
                        !author.social_links?.youtube && '—'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(author)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingAuthor(author);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No authors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAuthor ? 'Edit Author' : 'Add New Author'}</DialogTitle>
            <DialogDescription>
              {editingAuthor
                ? 'Update author information'
                : 'Create a new author profile for blog posts'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="john-doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Chief Investment Officer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Links</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Twitter URL"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
                <Input
                  placeholder="YouTube URL"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                />
                <Input
                  placeholder="Website URL"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAuthor} disabled={createAuthor.isPending || updateAuthor.isPending}>
              {editingAuthor ? 'Update' : 'Create'} Author
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Author</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAuthor?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAuthor} disabled={deleteAuthor.isPending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
