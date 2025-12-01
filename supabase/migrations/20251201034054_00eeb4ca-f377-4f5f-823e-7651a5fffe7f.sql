-- Add admin role for j@heady.fm user
INSERT INTO public.user_roles (user_id, role)
VALUES ('640dfaee-222f-43bb-bee4-3f0075d4e92f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;