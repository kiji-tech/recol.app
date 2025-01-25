

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message" "text",
    "sender_id" "uuid",
    "is_view" "uuid"[],
    "plan_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plan" (
    "from" timestamp with time zone,
    "to" timestamp with time zone,
    "locations" "text"[] DEFAULT '{}'::"text"[],
    "delete_flag" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" "text",
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "place_id_list" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."plan" OWNER TO "postgres";


COMMENT ON TABLE "public"."plan" IS '旅行の計画テーブル';



CREATE TABLE IF NOT EXISTS "public"."schedule" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "from" timestamp without time zone,
    "to" timestamp without time zone,
    "plan_id" "uuid",
    "place_id" character varying,
    "title" character varying,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."schedule" OWNER TO "postgres";


COMMENT ON TABLE "public"."schedule" IS 'スケジュール';



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("uid");



ALTER TABLE ONLY "public"."plan"
    ADD CONSTRAINT "plan_pkey" PRIMARY KEY ("uid");



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_pkey" PRIMARY KEY ("uid");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("uid");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("uid");



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_all_policy" ON "public"."messages" USING (true) WITH CHECK (true);



ALTER TABLE "public"."plan" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "plan_policy" ON "public"."plan" USING (true) WITH CHECK (true);



ALTER TABLE "public"."schedule" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."schedule";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


















































































































































































































GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."plan" TO "anon";
GRANT ALL ON TABLE "public"."plan" TO "authenticated";
GRANT ALL ON TABLE "public"."plan" TO "service_role";



GRANT ALL ON TABLE "public"."schedule" TO "anon";
GRANT ALL ON TABLE "public"."schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
