-- Add Paladin active ability: Judgment
-- Gain +10 for each opponent ahead of you (by total score), capped at +50.
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (4, 'Judgment', 'Gain +10 for each opponent ahead of you (max +50).');

