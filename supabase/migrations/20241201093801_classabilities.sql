-- 1. Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Create abilities table
CREATE TABLE IF NOT EXISTS public.abilities (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Modify participation table
ALTER TABLE public.participation
ADD COLUMN class_id INTEGER REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE public.participation
ADD COLUMN ability_used TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 4. Enable row-level security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for classes table
CREATE POLICY "Allow SELECT on classes for all" ON public.classes
FOR SELECT
USING (true);

CREATE POLICY "Restrict INSERT on classes to service_role" ON public.classes
FOR INSERT
TO service_role
WITH CHECK (true);

-- 6. Create policies for abilities table
CREATE POLICY "Allow SELECT on abilities for all" ON public.abilities
FOR SELECT
USING (true);

CREATE POLICY "Restrict INSERT on abilities to service_role" ON public.abilities
FOR INSERT
TO service_role
WITH CHECK (true);

-- 7. Grant permissions
GRANT SELECT ON TABLE public.classes TO anon, authenticated;
GRANT SELECT ON TABLE public.abilities TO anon, authenticated;

GRANT ALL ON TABLE public.classes TO service_role;
GRANT ALL ON TABLE public.abilities TO service_role;

-- 8. Insert initial data
-- Classes
INSERT INTO public.classes (name)
VALUES
    ('Thief'),
    ('Necromancer'),
    ('Barbarian');

-- Abilities
INSERT INTO public.abilities (class_id, name, description)
VALUES
    (1, 'Cutpurse', 'Steal a random score from a player'),
    (2, 'Crimson Reap', 'Lower the scores of other players (max 5) by 10-20 points'),
    (3, 'Infernal Rage', 'Double your entry score (max 99)');

-- 9. Update existing data in participation table
UPDATE public.participation SET class_id = NULL WHERE class_id IS NULL;