alter table "public"."subscription" add constraint "subscription_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profile(uid) not valid;

alter table "public"."subscription" validate constraint "subscription_user_id_fkey1";

create policy "UserSubscriptionPolicy"
on "public"."subscription"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "policy_service_role"
on "public"."subscription"
as permissive
for all
to service_role
using (true)
with check (true);



