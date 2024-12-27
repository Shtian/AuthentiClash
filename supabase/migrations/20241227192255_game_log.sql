-- 1. Create game_log table
CREATE TABLE IF NOT EXISTS public.game_log (
    id SERIAL PRIMARY KEY,
    game_id bigint,
    text TEXT NOT NULL,
    text_ai TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Add foreign key constraint
ALTER TABLE ONLY "public"."game_log"
    ADD CONSTRAINT "public_game_log_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;

-- 3. Enable row-level security
ALTER TABLE public.game_log ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for game_log table
CREATE POLICY "Allow SELECT on game_log for all" ON public.classes
FOR SELECT
USING (true);

CREATE POLICY "Restrict INSERT on game_log to service_role" ON public.classes
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. Grant permissions
GRANT SELECT ON TABLE public.game_log TO anon, authenticated;

GRANT ALL ON TABLE public.game_log TO service_role;