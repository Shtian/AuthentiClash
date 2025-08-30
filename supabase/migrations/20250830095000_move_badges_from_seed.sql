-- Move badges from seed.sql into a proper migration.
-- Uses UPSERT on unique slug to be idempotent across environments.

INSERT INTO public.badges (name, description, enabled, secret, slug, image, sort_order)
VALUES
  ('First Blood', 'Milestone: First Win', TRUE, FALSE, 'first-blood', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/first-blood.webp', 1),
  ('High Five', 'Milestone: 5 Wins', TRUE, FALSE, 'high-five', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/high-five.webp', 2),
  ('The Fellowship of the Win', 'Milestone: 10 Wins', TRUE, FALSE, 'fellowship-of-the-win', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/fellowship-of-the-win.webp', 3),
  ('20/20 Victory Vision', 'Milestone: 20 Wins', TRUE, FALSE, '20-20-victory-vision', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/20-20-victory-vision.webp', 4),
  ('AuthentiChampion', 'Milestone: 50 Wins', TRUE, FALSE, 'authentichampion', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/authentichampion.webp', 5),
  ('Rite of Passage', 'Milestone: Placed Last 1 Time', TRUE, FALSE, 'rite-of-passage', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/rite-of-passage.webp', 6),
  ('Echoes From the Abyss', 'Milestone: Placed Last 5 Times', TRUE, FALSE, 'echoes-from-the-abyss', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/echoes-from-the-abyss.webp', 7),
  ('Humble Begginings', 'Milestone: 1000 Points Accumulated', TRUE, FALSE, 'humble-beginnings', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/humble-beginnings.webp', 8),
  ('Hoarder', 'Milestone: 5000 Points Accumulated', TRUE, FALSE, 'hoarder', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/hoarder.webp', 9),
  ('It''s Over 9000!', 'Milestone: 9001 Points Accumulated', TRUE, FALSE, 'its-over-9000', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/its-over-9000.webp', 10),
  ('Luck''s Fickle Finger', 'For when fate hands you the number 1, a badge recognizing the whims of chance and your resilience.', TRUE, FALSE, 'lucks-fickle-finger', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/lucks-fickle-finger.webp', 11),
  ('Cloud 99', 'Reserved for those touched by serendipity, this marks a moment of extraordinary luck, as elusive and uplifting as the rarest stratus in the highest heavens.', TRUE, FALSE, 'cloud-99', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/cloud-99.webp', 12),
  ('Comeback Kid', 'For those who turn the tide, snatching victory from the jaws of defeat.', TRUE, FALSE, 'comeback-kid', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/comeback-kid.webp', 13),
  ('Free fall!', 'For those who have experienced the thrill of free falling from the top of the leaderboard to the bottom.', TRUE, FALSE, 'free-fall', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/free-fall.webp', 14),
  ('Twinzies', 'Awarded when fate aligns and you finish with the exact same total score as another player.', TRUE, FALSE, 'twinzies', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/twinzies.webp', 15),
  ('Nice', '', TRUE, TRUE, 'nice', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/nice.webp', 16),
  ('What Are the Odds', 'Bestowed for the serendipitous entry of a 2FA code that matches the current hour, minute or seconds, celebrating a rare moment of cosmic alignment.', TRUE, TRUE, 'what-are-the-odds', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/what-are-the-odds.webp', 17),
  ('Triskaidekaphilia', 'A badge of honor for those who delight in the mystical and challenge the notion of luck, turning the tide of superstition into a symbol of fearless exploration.', TRUE, TRUE, 'triskaidekaphilia', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/triskaidekaphilia.webp', 18),
  ('The Answer', '“''The Answer to the Great Question... Of Life, the Universe and Everything... Is... Forty-two,'' said Deep Thought, with infinite majesty and calm.”', TRUE, TRUE, 'the-answer', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/the-answer.webp', 19),
  ('Early Bird', 'Awarded to those who rise with the dawn, the ''Early Bird'' badge celebrates your proactive spirit in making score entries between 4 AM and 7 AM.', TRUE, TRUE, 'early-bird', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/early-bird.webp', 20),
  ('Night Owl', 'Bestowed upon those who thrive in the quiet hours of the night, the ''Night Owl'' badge honors your dedication to scoring entries between midnight and 4 AM.', TRUE, TRUE, 'night-owl', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/night-owl.webp', 21),
  ('Participation Award', 'Milestone: 5 games without win or loss', TRUE, FALSE, 'participation-award', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/participation-award.webp', 22),
  ('Aggressively Average', 'Milestone: 10 games without win or loss', TRUE, FALSE, 'aggressively-average', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/aggressively-average.webp', 23),
  ('Lean Mean AuthentiClash Machine', 'Milestone: 20 games without win or loss', TRUE, FALSE, 'lean-mean-authenticlash-machine', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/lean-mean-authenticlash-machine.webp', 24),
  ('Wouldn''t Stick Out In A Crowd Of One', 'Milestone: 50 games without win or loss', TRUE, FALSE, 'wouldnt-stick-out-in-a-crowd-of-one', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/wouldnt-stick-out-in-a-crowd-of-one.webp', 25),
  ('Lucky In Love', 'Ended a game with four or more scores all under 50', TRUE, TRUE, 'lucky-in-love', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/lucky-in-love.webp', 26),
  ('Literally Can''t Believe It', 'Ended a game with four or more scores all above 50', TRUE, TRUE, 'literally-cant-believe-it', 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/literally-cant-believe-it.webp', 27)
