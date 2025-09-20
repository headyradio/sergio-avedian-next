-- Create an admin user directly (bypassing email confirmation)
-- This gives you immediate access to the CMS

DO $$
DECLARE
    user_id uuid;
BEGIN
    -- Insert user into auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@example.com',
        crypt('admin123', gen_salt('bf')),
        NOW(), -- Email confirmed immediately
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        FALSE,
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO user_id;

    -- Insert corresponding identity
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        user_id,
        format('{"sub":"%s","email":"admin@example.com"}', user_id)::jsonb,
        'email',
        NOW(),
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created successfully with email: admin@example.com';
END $$;