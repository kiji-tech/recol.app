create table "public"."item_link" (
    "amazon_url" text,
    "rakuten_url" text,
    "category" character varying[] default '{}'::character varying[],
    "created_at" timestamp with time zone not null default now(),
    "id" uuid default gen_random_uuid()
);


alter table "public"."item_link" enable row level security;

grant delete on table "public"."item_link" to "anon";

grant insert on table "public"."item_link" to "anon";

grant references on table "public"."item_link" to "anon";

grant select on table "public"."item_link" to "anon";

grant trigger on table "public"."item_link" to "anon";

grant truncate on table "public"."item_link" to "anon";

grant update on table "public"."item_link" to "anon";

grant delete on table "public"."item_link" to "authenticated";

grant insert on table "public"."item_link" to "authenticated";

grant references on table "public"."item_link" to "authenticated";

grant select on table "public"."item_link" to "authenticated";

grant trigger on table "public"."item_link" to "authenticated";

grant truncate on table "public"."item_link" to "authenticated";

grant update on table "public"."item_link" to "authenticated";

grant delete on table "public"."item_link" to "service_role";

grant insert on table "public"."item_link" to "service_role";

grant references on table "public"."item_link" to "service_role";

grant select on table "public"."item_link" to "service_role";

grant trigger on table "public"."item_link" to "service_role";

grant truncate on table "public"."item_link" to "service_role";

grant update on table "public"."item_link" to "service_role";

create policy "item_link_policy"
on "public"."item_link"
as permissive
for select
to anon, postgres, authenticated
using (true);



