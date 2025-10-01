alter table "public"."message" drop constraint "messages_plan_id_fkey";

alter table "public"."message" drop constraint "messages_sender_id_fkey";

alter table "public"."subscription" drop constraint "subscription_user_id_fkey1";

alter table "public"."media" drop constraint "media_plan_id_fkey";

alter table "public"."media" drop constraint "media_upload_user_id_fkey";

alter table "public"."plan" drop constraint "plan_user_id_fkey";

alter table "public"."profile" drop constraint "profile_uid_fkey";

alter table "public"."schedule" drop constraint "schedule_plan_id_fkey";

alter table "public"."subscription" drop constraint "subscription_user_id_fkey";

alter table "public"."profile" add column "delete_flag" boolean default false;

alter table "public"."profile" add column "payment_end_at" timestamp with time zone;

alter table "public"."message" add constraint "message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message" validate constraint "message_sender_id_fkey";

alter table "public"."media" add constraint "media_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plan(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."media" validate constraint "media_plan_id_fkey";

alter table "public"."media" add constraint "media_upload_user_id_fkey" FOREIGN KEY (upload_user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."media" validate constraint "media_upload_user_id_fkey";

alter table "public"."plan" add constraint "plan_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."plan" validate constraint "plan_user_id_fkey";

alter table "public"."profile" add constraint "profile_uid_fkey" FOREIGN KEY (uid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_uid_fkey";

alter table "public"."schedule" add constraint "schedule_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plan(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."schedule" validate constraint "schedule_plan_id_fkey";

alter table "public"."subscription" add constraint "subscription_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscription" validate constraint "subscription_user_id_fkey";


