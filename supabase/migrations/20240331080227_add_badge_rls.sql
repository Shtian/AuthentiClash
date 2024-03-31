create policy "Enable read access for all users"
on "public"."badges"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."player_badges"
as permissive
for insert
to service_role
with check (true);


create policy "Enable read access for all users"
on "public"."player_badges"
as permissive
for select
to anon
using (true);



