alter table "public"."media" add column "schedule_id" uuid;

alter table "public"."media" add constraint "media_schedule_id_fkey" FOREIGN KEY (schedule_id) REFERENCES public.schedule(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."media" validate constraint "media_schedule_id_fkey";


