-- 1. Insert paladin class
INSERT INTO public.classes (name)
VALUES
    ('Paladin');

-- 2. Insert paladin abilities
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (4, 'Divine Aegis', '(Passive) Block 75% of incoming damage');