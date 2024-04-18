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
            TRUE,
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
INSERT INTO badges (id, created_at, name, description, enabled, secret, slug, image, sort_order) VALUES
(1, NOW(), 'First Blood', 'Milestone: First Win', TRUE, FALSE, 'first-blood', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/first-blood.webp', 1),
(2, NOW(), 'High Five', 'Milestone: 5 Wins', TRUE, FALSE, 'high-five', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/high-five.webp', 2),
(3, NOW(), 'The Fellowship of the Win', 'Milestone: 10 Wins', TRUE, FALSE, 'fellowship-of-the-win', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/fellowship-of-the-win.webp', 3),
(4, NOW(), '20/20 Victory Vision', 'Milestone: 20 Wins', TRUE, FALSE, '20-20-victory-vision', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/20-20-victory-vision.webp', 4),
(5, NOW(), 'AuthentiChampion', 'Milestone: 50 Wins', TRUE, FALSE, 'authentichampion', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/authentichampion.webp', 5),
(6, NOW(), 'Rite of Passage', 'Milestone: Placed Last 1 Time', TRUE, FALSE, 'rite-of-passage', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/rite-of-passage.webp', 6),
(7, NOW(), 'Echoes From the Abyss', 'Milestone: Placed Last 5 Times', TRUE, FALSE, 'echoes-from-the-abyss', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/echoes-from-the-abyss.webp', 7),
(16, NOW(), 'Humble Begginings', 'Milestone: 1000 Points Accumulated', TRUE, FALSE, 'humble-beginnings', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/humble-beginnings.webp', 8),
(17, NOW(), 'Hoarder', 'Milestone: 5000 Points Accumulated', TRUE, FALSE, 'hoarder', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/hoarder.webp', 9),
(18, NOW(), 'It''s Over 9000!', 'Milestone: 9001 Points Accumulated', TRUE, FALSE, 'its-over-9000', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/its-over-9000.webp', 10),
(9, NOW(), 'Luck''s Fickle Finger', 'For when fate hands you the number 1, a badge recognizing the whims of chance and your resilience.', TRUE, FALSE, 'lucks-fickle-finger', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/lucks-fickle-finger.webp', 11),
(10, NOW(), 'Cloud 99', 'Reserved for those touched by serendipity, this marks a moment of extraordinary luck, as elusive and uplifting as the rarest stratus in the highest heavens.', TRUE, FALSE, 'cloud-99', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/cloud-99.webp', 12),
(14, NOW(), 'Comeback Kid', 'For those who turn the tide, snatching victory from the jaws of defeat.', TRUE, FALSE, 'comeback-kid', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/comeback-kid.webp', 13),
(15, NOW(), 'Free fall!', 'For those who have experienced the thrill of free falling from the top of the leaderboard to the bottom.', TRUE, FALSE, 'free-fall', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/free-fall.webp', 14),
(19, NOW(), 'Twinzies', 'Awarded when fate aligns and you finish with the exact same total score as another player.', TRUE, FALSE, 'twinzies', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/twinzies.webp', 15),
(11, NOW(), 'Nice', '', TRUE, TRUE, 'nice', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/nice.webp', 16),
(8, NOW(), 'What Are the Odds', 'Bestowed for the serendipitous entry of a 2FA code that matches the current hour, minute or seconds, celebrating a rare moment of cosmic alignment.', TRUE, TRUE, 'what-are-the-odds', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/what-are-the-odds.webp', 17),
(12, NOW(), 'Triskaidekaphilia', 'A badge of honor for those who delight in the mystical and challenge the notion of luck, turning the tide of superstition into a symbol of fearless exploration.', TRUE, TRUE, 'triskaidekaphilia', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/triskaidekaphilia.webp', 18),
(13, NOW(), 'The Answer', '“''The Answer to the Great Question... Of Life, the Universe and Everything... Is... Forty-two,'' said Deep Thought, with infinite majesty and calm.”', TRUE, TRUE, 'the-answer', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/the-answer.webp', 19),
(20, NOW(), 'Early Bird', 'Awarded to those who rise with the dawn, the ''Early Bird'' badge celebrates your proactive spirit in making score entries between 4 AM and 7 AM.', TRUE, TRUE, 'early-bird', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/early-bird.webp', 20),
(21, NOW(), 'Night Owl', 'Bestowed upon those who thrive in the quiet hours of the night, the ''Night Owl'' badge honors your dedication to scoring entries between midnight and 4 AM.', TRUE, TRUE, 'night-owl', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/night-owl.webp', 21);