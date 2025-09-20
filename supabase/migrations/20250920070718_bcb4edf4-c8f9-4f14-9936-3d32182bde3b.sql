-- Let's create a simple admin user using the signup method that will work
-- First delete any existing conflicting users
DELETE FROM auth.identities WHERE provider = 'email' AND identity_data->>'email' = 'admin@test.com';
DELETE FROM auth.users WHERE email = 'admin@test.com';

-- Create a new admin user with confirmed email
DO $$
DECLARE
    user_id uuid := gen_random_uuid();
BEGIN
    -- Insert user into auth.users with confirmed email
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        phone_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_sent_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        'admin@test.com',
        crypt('password123', gen_salt('bf')),
        NOW(), -- This confirms the email immediately
        NULL,
        '',
        '',
        '',
        '',
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        FALSE,
        NOW()
    );

    -- Insert identity record
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        user_id,
        format('{"sub":"%s","email":"admin@test.com","email_verified":true,"phone_verified":false}', user_id)::jsonb,
        'email',
        user_id::text,
        NOW(),
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created: admin@test.com / password123';
END $$;