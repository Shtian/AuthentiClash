-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

-- Add profiles for test users
-- If profiles are added automatically, use this instead of insert
UPDATE public.profiles
SET username = 'user ' || SUBSTRING(id::text FROM 1 FOR 8),
    avatar_url = 'https://api.dicebear.com/8.x/adventurer/svg?seed=' || SUBSTRING(id::text FROM 1 FOR 8),
    updated_at = current_timestamp
WHERE id IN (SELECT id FROM auth.users);

-- Add games
INSERT INTO
    public.games (
        created_at,
        name,
        code,
        is_active,
        creator,
        end_at,
        updated_at,
        cooldown_hours,
        ai_enabled
    ) (
        select
            current_timestamp,
            'Game ' || (ROW_NUMBER() OVER ()),
            'game-' || SUBSTRING((uuid_generate_v4 ())::text FROM 1 FOR 8) || '-' || SUBSTRING((uuid_generate_v4 ())::text FROM 1 FOR 8),
            CASE
                WHEN (ROW_NUMBER() OVER ()) <= 5 THEN true
                ELSE false
            END,
            id,
            CASE
                WHEN (ROW_NUMBER() OVER ()) <= 5 THEN current_timestamp + interval '5 days'
                ELSE current_timestamp - interval '1 day'
            END,
            current_timestamp,
            (ROW_NUMBER() OVER ()) % 2,
            false
        from
            auth.users
    );

-- Add badges
INSERT INTO badges (id, created_at, name, description, enabled, secret, slug, image) VALUES
(1, NOW(), 'First Blood', 'Granted after securing your initial victory, marking the beginning of your ascent in AuthentiClash.', FALSE, FALSE, 'first-blood', NULL),
(2, NOW(), 'High Five', 'Awarded for reaching the landmark of 5 wins, showcasing your burgeoning prowess.', FALSE, FALSE, 'high-five', NULL),
(3, NOW(), 'The Fellowship of the Win', 'Bestowed for achieving 10 wins, proving your worth in the face of challenge.', FALSE, FALSE, 'fellowship-of-the-win', NULL),
(4, NOW(), '20/20 Victory Vision', 'Conferred upon reaching 20 wins, a testament to your clarity of vision and unmatched skill.', FALSE, FALSE, '20-20-victory-vision', NULL),
(5, NOW(), 'AuthentiChampion', 'The ultimate accolade for surpassing 50 wins, crowning you as a champion of AuthentiClash.', FALSE, FALSE, 'authentichampion', NULL),
(6, NOW(), 'Rite of Passage', 'Granted after your first encounter with defeat, marking a crucial rite of passage in AuthentiClash.', FALSE, FALSE, 'rite-of-passage', NULL),
(7, NOW(), 'Echoes From the Abyss', 'Awarded to those who''ve experienced the shadow of last place in a total of 5 games, honoring your journey and perseverance.', FALSE, FALSE, 'echoes-from-the-abyss', NULL),
(8, NOW(), 'What Are the Odds', 'Bestowed for the serendipitous entry of a 2FA code that matches the current hour, minute or seconds, celebrating a rare moment of cosmic alignment.', TRUE, TRUE, 'what-are-the-odds', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/what-are-the-odds.webp'),
(9, NOW(), 'Luck''s Fickle Finger', 'For when fate hands you the number 1, a badge recognizing the whims of chance and your resilience.', TRUE, FALSE, 'lucks-fickle-finger', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/lucks-fickle-finger.webp'),
(10, NOW(), 'Cloud 99', 'Reserved for those touched by serendipity, this marks a moment of extraordinary luck, as elusive and uplifting as the rarest stratus in the highest heavens.', TRUE, FALSE, 'cloud-99', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/cloud-99.webp'),
(11, NOW(), 'Nice', '', TRUE, TRUE, 'nice', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/nice.webp');
