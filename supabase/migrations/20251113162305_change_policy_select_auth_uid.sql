create extension if not exists "pg_cron" with schema "pg_catalog";

drop policy "policy_profile_selecte" on "public"."profile";


  create policy "policy_profile_selecte"
  on "public"."profile"
  as permissive
  for select
  to authenticated, anon
using ((uid = ( SELECT auth.uid() AS uid)));

