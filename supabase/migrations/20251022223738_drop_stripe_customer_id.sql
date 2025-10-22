alter table "public"."profile" drop constraint "profile_stripe_customer_key";

drop index if exists "public"."profile_stripe_customer_key";

alter table "public"."profile" drop column "stripe_customer_id";


