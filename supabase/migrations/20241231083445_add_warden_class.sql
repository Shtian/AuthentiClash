-- 1. Insert warden class
INSERT INTO public.classes (name)
VALUES
    ('Warden');

-- 2. Insert warden abilities
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (5, 'Protector''s Oath', 'Heal the last player for 30-40 points and get 25% back');