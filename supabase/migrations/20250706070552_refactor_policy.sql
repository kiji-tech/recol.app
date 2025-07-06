drop policy "profile_all_policy" on "public"."profile";

drop policy "ユーザーは自分のプロフィールを参照・更新で" on "public"."profile";

drop policy "ユーザーは自分のプロフィールを管理できる" on "public"."profile";

drop policy "policy_media" on "public"."media";

drop policy "messages_all_policy" on "public"."message";

drop policy "schedule_all_policy" on "public"."schedule";

create policy "policy_profile_insert"
on "public"."profile"
as permissive
for insert
to authenticated
with check ((uid = ( SELECT auth.uid() AS uid)));


create policy "policy_profile_selecte"
on "public"."profile"
as permissive
for select
to authenticated, anon
using ((uid = auth.uid()));


create policy "policy_profile_update"
on "public"."profile"
as permissive
for update
to authenticated
using ((uid = ( SELECT auth.uid() AS uid)))
with check ((uid = ( SELECT auth.uid() AS uid)));


create policy "policy_media"
on "public"."media"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM plan p
  WHERE ((p.uid = media.plan_id) AND (p.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM plan p
  WHERE ((p.uid = media.plan_id) AND (p.user_id = ( SELECT auth.uid() AS uid))))));


create policy "messages_all_policy"
on "public"."message"
as permissive
for all
to public
using ((uid = ( SELECT auth.uid() AS uid)))
with check ((uid = ( SELECT auth.uid() AS uid)));


create policy "schedule_all_policy"
on "public"."schedule"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT p.user_id
   FROM plan p
  WHERE (p.uid = schedule.plan_id))))
with check ((( SELECT auth.uid() AS uid) IN ( SELECT p.user_id
   FROM plan p
  WHERE (p.uid = schedule.plan_id))));



