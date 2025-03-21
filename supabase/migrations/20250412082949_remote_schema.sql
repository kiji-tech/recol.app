alter table "public"."schedule" enable row level security;

create policy "Authenticated users can select their own records"
on "public"."schedule"
as permissive
for select
to authenticated
using (true);



