-- Add endgame_image_url to games table to persist generated endgame images
ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS endgame_image_url TEXT NULL;

