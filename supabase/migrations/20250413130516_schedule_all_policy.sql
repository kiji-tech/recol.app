alter table "public"."item_link" alter column "id" set not null;

alter table "public"."schedule" enable row level security;

CREATE UNIQUE INDEX item_link_pkey ON public.item_link USING btree (id);

alter table "public"."item_link" add constraint "item_link_pkey" PRIMARY KEY using index "item_link_pkey";

create policy "schedule_all_policy"
on "public"."schedule"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT p.user_id
   FROM plan p
  WHERE (p.uid = schedule.plan_id))))
with check ((auth.uid() IN ( SELECT p.user_id
   FROM plan p
  WHERE (p.uid = schedule.plan_id))));



