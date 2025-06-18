create type "public"."PaymentPlan" as enum ('Free', 'Basic', 'Premium');

create type "public"."Role" as enum ('Admin', 'SuperUser', 'User');

create table "public"."subscription" (
    "uid" text not null,
    "price_id" text not null,
    "customer_id" text not null,
    "invoice_id" text not null,
    "status" text,
    "start_at" timestamp with time zone,
    "end_at" timestamp with time zone,
    "canceled_at" timestamp with time zone,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "trial_start" timestamp with time zone,
    "trial_end" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid
);


alter table "public"."subscription" enable row level security;

alter table "public"."profile" add column "payment_plan" "PaymentPlan" default 'Free'::"PaymentPlan";

alter table "public"."profile" add column "role" "Role" default 'User'::"Role";

alter table "public"."profile" add column "stripe_customer_id" text default ''::text;

CREATE UNIQUE INDEX profile_stripe_customer_key ON public.profile USING btree (stripe_customer_id);

CREATE UNIQUE INDEX subscription_pkey ON public.subscription USING btree (uid);

alter table "public"."subscription" add constraint "subscription_pkey" PRIMARY KEY using index "subscription_pkey";

alter table "public"."profile" add constraint "profile_stripe_customer_key" UNIQUE using index "profile_stripe_customer_key";

alter table "public"."subscription" add constraint "subscription_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscription" validate constraint "subscription_user_id_fkey";

grant delete on table "public"."subscription" to "anon";

grant insert on table "public"."subscription" to "anon";

grant references on table "public"."subscription" to "anon";

grant select on table "public"."subscription" to "anon";

grant trigger on table "public"."subscription" to "anon";

grant truncate on table "public"."subscription" to "anon";

grant update on table "public"."subscription" to "anon";

grant delete on table "public"."subscription" to "authenticated";

grant insert on table "public"."subscription" to "authenticated";

grant references on table "public"."subscription" to "authenticated";

grant select on table "public"."subscription" to "authenticated";

grant trigger on table "public"."subscription" to "authenticated";

grant truncate on table "public"."subscription" to "authenticated";

grant update on table "public"."subscription" to "authenticated";

grant delete on table "public"."subscription" to "service_role";

grant insert on table "public"."subscription" to "service_role";

grant references on table "public"."subscription" to "service_role";

grant select on table "public"."subscription" to "service_role";

grant trigger on table "public"."subscription" to "service_role";

grant truncate on table "public"."subscription" to "service_role";

grant update on table "public"."subscription" to "service_role";


