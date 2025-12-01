-- Insert admin role for the existing admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('4526a40b-1b24-4f11-a358-e490107b2457', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Add RLS policy to allow users to read their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END
$$;