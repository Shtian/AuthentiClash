-- Add background_prompt to games table
ALTER TABLE public.games
ADD COLUMN background_prompt TEXT NULL;
