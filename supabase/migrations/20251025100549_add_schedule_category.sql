create type "public"."ScheduleCategory" as enum ('Movement', 'Shopping', 'Cafe', 'Meals', 'Amusement', 'Other');

alter table "public"."schedule" alter column "category" set data type "ScheduleCategory" using "category"::text::"ScheduleCategory";


