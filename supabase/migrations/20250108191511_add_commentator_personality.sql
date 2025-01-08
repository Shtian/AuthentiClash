-- Add commentator_personality to games table
ALTER TABLE public.games
ADD COLUMN commentator_personality TEXT NULL;
