-- Allow service_role to perform all operations on games
-- Note: service_role typically bypasses RLS, but this policy makes it explicit.

CREATE POLICY "Allow ALL on games to service_role"
ON public.games
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

