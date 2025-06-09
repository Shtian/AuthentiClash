-- 1. Insert diceblade class
INSERT INTO public.classes (name)
VALUES
    ('Diceblade');

-- 2. Insert diceblade abilities
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (6, 'Fateful Flick', '(Passive) Push your luck to the max: 33% chance to gain +10 pts, otherwise lose 5 pts.'),
    (6, 'Final Wager', 'You go all-in. 50% chance to gain +50 pts, otherwise lose 50 pts.');
