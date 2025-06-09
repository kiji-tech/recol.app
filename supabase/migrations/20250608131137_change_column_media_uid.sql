alter table "public"."media" drop constraint "media_pkey";

drop index if exists "public"."media_pkey";

alter table "public"."media" drop column "uid";

alter table "public"."media" add column "uid" uuid not null;
alter table "public"."media" alter column "uid" set default gen_random_uuid();


CREATE UNIQUE INDEX media_uid_key ON public.media USING btree (uid);
alter table "public"."media" add constraint "media_uid_key" UNIQUE using index "media_uid_key";


