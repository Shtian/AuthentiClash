-- Add Barbarian passive ability: Berserker's Reprisal
-- (Passive) After each negative entry, gain a Rage stack (max 3).
-- Positive entries are boosted: 1=+15%, 2=+20%, 3=+25%.
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (3, 'Berserker''s Reprisal', '(Passive) After each negative entry, gain a Rage stack (max 3). Positive entries are boosted: 1=+15%, 2=+20%, 3=+25%.');

