alter table "public"."profile" add column "enabled_schedule_notification" boolean default false;

alter table "public"."profile" add column "notification_token" text;


