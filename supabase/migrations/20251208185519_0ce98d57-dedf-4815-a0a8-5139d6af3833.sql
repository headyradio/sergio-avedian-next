-- Add admin role for johanmore@gmail.com (user_id from auth logs: a82bfedb-4068-48b5-979f-c7cf2b005f8c)
INSERT INTO public.user_roles (user_id, role)
VALUES ('a82bfedb-4068-48b5-979f-c7cf2b005f8c', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;