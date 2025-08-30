-- Enable Row Level Security on participation and add policies
-- - Public (anon, authenticated) may read all rows
-- - service_role may perform all operations

alter table if exists public.participation enable row level security;

-- Allow public roles to read participation rows
create policy "Public can read participation"
on public.participation
for select
to anon, authenticated
using (true);

-- Ensure service_role can do all operations
create policy "Service role full access to participation"
on public.participation
for all
to service_role
using (true)
with check (true);

