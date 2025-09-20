-- Create a properly formatted admin user
DO $$
DECLARE
    user_id uuid := gen_random_uuid();
    identity_id uuid := gen_random_uuid();
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
        user_id,
        'authenticated',
        'authenticated',
        'admin@sergioavedian.com',
        crypt('SergioCMS2024!', gen_salt('bf')),
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
    );

    -- Insert corresponding identity with provider_id
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at,
        email
    ) VALUES (
        identity_id,
        user_id,
        format('{"sub":"%s","email":"admin@sergioavedian.com","email_verified":true,"phone_verified":false}', user_id)::jsonb,
        'email',
        user_id::text,
        NOW(),
        NOW(),
        NOW(),
        'admin@sergioavedian.com'
    );

    RAISE NOTICE 'Admin user created successfully!';
END $$;