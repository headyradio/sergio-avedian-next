import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface AutosaveOptions {
  postId?: string;
  data: any;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export const useAutosave = ({ postId, data, interval = 30000, enabled = true }: AutosaveOptions) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const saveDraft = useMutation({
    mutationFn: async (draftData: any) => {
      if (!postId) return null;
      
      const { data, error } = await supabase
        .from('cms_blog_post_drafts')
        .insert({
          post_id: postId,
          content: draftData,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Autosave error:', error);
      setIsSaving(false);
    },
  });

  // Autosave effect
  useEffect(() => {
    if (!enabled || !postId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      saveDraft.mutate(dataRef.current);
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, enabled, postId]);

  const forceSave = () => {
    if (!postId) return;
    setIsSaving(true);
    saveDraft.mutate(dataRef.current);
  };

  return {
    lastSaved,
    isSaving,
    forceSave,
  };
};

export const useDraftHistory = (postId?: string) => {
  return {
    queryKey: ['draft-history', postId],
    queryFn: async () => {
      if (!postId) return [];
      
      const { data, error } = await supabase
        .from('cms_blog_post_drafts')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  };
};
