alter table "public"."schedule" alter column "place_list" drop default;

alter table "public"."schedule" alter column "place_list" set data type text[] using "place_list"::text[];


