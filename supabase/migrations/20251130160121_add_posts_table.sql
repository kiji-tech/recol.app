create type "public"."PostsReportCategory" as enum ('Inappropriate', 'Offensive', 'Privacy', 'Other');

alter table "public"."profile" alter column "role" drop default;

alter type "public"."Role" rename to "Role__old_version_to_be_dropped";

create type "public"."Role" as enum ('Admin', 'SuperUser', 'User', 'Tester');


  create table "public"."posts" (
    "uid" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "place_id" text not null,
    "body" text not null,
    "medias" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "delete_flag" boolean default false
      );


alter table "public"."posts" enable row level security;


  create table "public"."posts_report" (
    "uid" uuid not null default gen_random_uuid(),
    "posts_id" uuid not null,
    "body" text,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "category_id" public."PostsReportCategory"
      );


alter table "public"."posts_report" enable row level security;

alter table "public"."profile" alter column role type "public"."Role" using role::text::"public"."Role";

alter table "public"."profile" alter column "role" set default 'User'::public."Role";

drop type "public"."Role__old_version_to_be_dropped";

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (uid);

CREATE UNIQUE INDEX posts_report_pkey ON public.posts_report USING btree (uid);

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."posts_report" add constraint "posts_report_pkey" PRIMARY KEY using index "posts_report_pkey";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(uid) not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

alter table "public"."posts_report" add constraint "posts_report_posts_id_fkey" FOREIGN KEY (posts_id) REFERENCES public.posts(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."posts_report" validate constraint "posts_report_posts_id_fkey";

alter table "public"."posts_report" add constraint "posts_report_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(uid) not valid;

alter table "public"."posts_report" validate constraint "posts_report_user_id_fkey";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "postgres";

grant insert on table "public"."posts" to "postgres";

grant references on table "public"."posts" to "postgres";

grant select on table "public"."posts" to "postgres";

grant trigger on table "public"."posts" to "postgres";

grant truncate on table "public"."posts" to "postgres";

grant update on table "public"."posts" to "postgres";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."posts_report" to "anon";

grant insert on table "public"."posts_report" to "anon";

grant references on table "public"."posts_report" to "anon";

grant select on table "public"."posts_report" to "anon";

grant trigger on table "public"."posts_report" to "anon";

grant truncate on table "public"."posts_report" to "anon";

grant update on table "public"."posts_report" to "anon";

grant delete on table "public"."posts_report" to "authenticated";

grant insert on table "public"."posts_report" to "authenticated";

grant references on table "public"."posts_report" to "authenticated";

grant select on table "public"."posts_report" to "authenticated";

grant trigger on table "public"."posts_report" to "authenticated";

grant truncate on table "public"."posts_report" to "authenticated";

grant update on table "public"."posts_report" to "authenticated";

grant delete on table "public"."posts_report" to "postgres";

grant insert on table "public"."posts_report" to "postgres";

grant references on table "public"."posts_report" to "postgres";

grant select on table "public"."posts_report" to "postgres";

grant trigger on table "public"."posts_report" to "postgres";

grant truncate on table "public"."posts_report" to "postgres";

grant update on table "public"."posts_report" to "postgres";

grant delete on table "public"."posts_report" to "service_role";

grant insert on table "public"."posts_report" to "service_role";

grant references on table "public"."posts_report" to "service_role";

grant select on table "public"."posts_report" to "service_role";

grant trigger on table "public"."posts_report" to "service_role";

grant truncate on table "public"."posts_report" to "service_role";

grant update on table "public"."posts_report" to "service_role";


  create policy "delete_posts_policy"
  on "public"."posts"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "insert_posts_policy"
  on "public"."posts"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "select_post_policy"
  on "public"."posts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "update_posts_policy"
  on "public"."posts"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "insert_posts_report_policy"
  on "public"."posts_report"
  as permissive
  for insert
  to public
with check (true);



  create policy "insert_posts_policy 1rma4z_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'posts'::text));



  create policy "select_posts_policy 1rma4z_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using (((bucket_id = 'posts'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));



