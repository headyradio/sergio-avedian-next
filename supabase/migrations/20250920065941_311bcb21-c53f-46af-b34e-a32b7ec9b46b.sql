-- Simplified admin user creation
DO $$
DECLARE
    user_id uuid := gen_random_uuid();
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
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        'admin@sergioavedian.com',
        crypt('SergioCMS2024!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}'
    );

    -- Insert corresponding identity (without email field as it's generated)
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
        format('{"sub":"%s","email":"admin@sergioavedian.com","email_verified":true}', user_id)::jsonb,
        'email',
        user_id::text,
        NOW(),
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created successfully with email: admin@sergioavedian.com';
END $$;