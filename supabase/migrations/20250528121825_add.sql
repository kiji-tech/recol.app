drop policy "item_link_policy" on "public"."item_link";

drop policy "messages_all_policy" on "public"."messages";

revoke delete on table "public"."item_link" from "anon";

revoke insert on table "public"."item_link" from "anon";

revoke references on table "public"."item_link" from "anon";

revoke select on table "public"."item_link" from "anon";

revoke trigger on table "public"."item_link" from "anon";

revoke truncate on table "public"."item_link" from "anon";

revoke update on table "public"."item_link" from "anon";

revoke delete on table "public"."item_link" from "authenticated";

revoke insert on table "public"."item_link" from "authenticated";

revoke references on table "public"."item_link" from "authenticated";

revoke select on table "public"."item_link" from "authenticated";

revoke trigger on table "public"."item_link" from "authenticated";

revoke truncate on table "public"."item_link" from "authenticated";

revoke update on table "public"."item_link" from "authenticated";

revoke delete on table "public"."item_link" from "service_role";

revoke insert on table "public"."item_link" from "service_role";

revoke references on table "public"."item_link" from "service_role";

revoke select on table "public"."item_link" from "service_role";

revoke trigger on table "public"."item_link" from "service_role";

revoke truncate on table "public"."item_link" from "service_role";

revoke update on table "public"."item_link" from "service_role";

revoke delete on table "public"."messages" from "anon";

revoke insert on table "public"."messages" from "anon";

revoke references on table "public"."messages" from "anon";

revoke select on table "public"."messages" from "anon";

revoke trigger on table "public"."messages" from "anon";

revoke truncate on table "public"."messages" from "anon";

revoke update on table "public"."messages" from "anon";

revoke delete on table "public"."messages" from "authenticated";

revoke insert on table "public"."messages" from "authenticated";

revoke references on table "public"."messages" from "authenticated";

revoke select on table "public"."messages" from "authenticated";

revoke trigger on table "public"."messages" from "authenticated";

revoke truncate on table "public"."messages" from "authenticated";

revoke update on table "public"."messages" from "authenticated";

revoke delete on table "public"."messages" from "service_role";

revoke insert on table "public"."messages" from "service_role";

revoke references on table "public"."messages" from "service_role";

revoke select on table "public"."messages" from "service_role";

revoke trigger on table "public"."messages" from "service_role";

revoke truncate on table "public"."messages" from "service_role";

revoke update on table "public"."messages" from "service_role";

alter table "public"."messages" drop constraint "messages_plan_id_fkey";

alter table "public"."messages" drop constraint "messages_sender_id_fkey";

alter table "public"."item_link" drop constraint "item_link_pkey";

alter table "public"."messages" drop constraint "messages_pkey";

drop index if exists "public"."item_link_pkey";

drop index if exists "public"."messages_pkey";

drop table "public"."item_link";

drop table "public"."messages";

create table "public"."message" (
    "uid" uuid not null default gen_random_uuid(),
    "message" text,
    "sender_id" uuid,
    "is_view" uuid[],
    "plan_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."message" enable row level security;

alter table "public"."plan" add column "memo" text;

CREATE UNIQUE INDEX messages_pkey ON public.message USING btree (uid);

alter table "public"."message" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."message" add constraint "messages_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plan(uid) not valid;

alter table "public"."message" validate constraint "messages_plan_id_fkey";

alter table "public"."message" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) not valid;

alter table "public"."message" validate constraint "messages_sender_id_fkey";

grant delete on table "public"."message" to "anon";

grant insert on table "public"."message" to "anon";

grant references on table "public"."message" to "anon";

grant select on table "public"."message" to "anon";

grant trigger on table "public"."message" to "anon";

grant truncate on table "public"."message" to "anon";

grant update on table "public"."message" to "anon";

grant delete on table "public"."message" to "authenticated";

grant insert on table "public"."message" to "authenticated";

grant references on table "public"."message" to "authenticated";

grant select on table "public"."message" to "authenticated";

grant trigger on table "public"."message" to "authenticated";

grant truncate on table "public"."message" to "authenticated";

grant update on table "public"."message" to "authenticated";

grant delete on table "public"."message" to "service_role";

grant insert on table "public"."message" to "service_role";

grant references on table "public"."message" to "service_role";

grant select on table "public"."message" to "service_role";

grant trigger on table "public"."message" to "service_role";

grant truncate on table "public"."message" to "service_role";

grant update on table "public"."message" to "service_role";

create policy "messages_all_policy"
on "public"."message"
as permissive
for all
to public
using (true)
with check (true);



