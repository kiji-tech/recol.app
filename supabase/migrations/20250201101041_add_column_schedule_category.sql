create type "public"."schedule_category" as enum ('movement', 'meals', 'sightseeing', 'other');

alter table "public"."schedule" add column "category" schedule_category;


