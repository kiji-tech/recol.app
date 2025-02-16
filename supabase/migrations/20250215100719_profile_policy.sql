create policy "profile_all_policy"
on "public"."profile"
as permissive
for all
to public
using (true)
with check ((uid = auth.uid()));


create policy "ユーザーは自分のプロフィールを参照・更新で"
on "public"."profile"
as permissive
for all
to public
using ((uid = auth.uid()));


create policy "ユーザーは自分のプロフィールを管理できる"
on "public"."profile"
as permissive
for all
to authenticated
using ((uid = auth.uid()));



