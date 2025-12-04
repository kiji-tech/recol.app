drop policy "policy_profile_selecte" on "public"."profile";

grant delete on table "public"."posts" to "postgres";

grant insert on table "public"."posts" to "postgres";

grant references on table "public"."posts" to "postgres";

grant select on table "public"."posts" to "postgres";

grant trigger on table "public"."posts" to "postgres";

grant truncate on table "public"."posts" to "postgres";

grant update on table "public"."posts" to "postgres";

grant delete on table "public"."posts_report" to "postgres";

grant insert on table "public"."posts_report" to "postgres";

grant references on table "public"."posts_report" to "postgres";

grant select on table "public"."posts_report" to "postgres";

grant trigger on table "public"."posts_report" to "postgres";

grant truncate on table "public"."posts_report" to "postgres";

grant update on table "public"."posts_report" to "postgres";


  create policy "policy_profile_selecte"
  on "public"."profile"
  as permissive
  for select
  to anon
using (true);



