alter table "public"."plan" add column "user_id" uuid;

alter table "public"."schedule" drop column "place_id";

alter table "public"."schedule" add column "place_list" jsonb[] default '{}'::jsonb[];

alter table "public"."schedule" disable row level security;

alter table "public"."plan" add constraint "plan_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."plan" validate constraint "plan_user_id_fkey";


