drop extension if exists "pg_net";


  create policy "policy_caches_bucket_delete"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'caches'::text));



  create policy "policy_caches_bucket_insert"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'caches'::text));



  create policy "policy_caches_bucket_select"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'caches'::text));



  create policy "policy_caches_bucket_update"
  on "storage"."objects"
  as permissive
  for update
  to public
with check ((bucket_id = 'caches'::text));



  create policy "アバター画像は公開"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "メディアポリシー 1h7a3v3_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'medias'::text) AND (EXISTS ( SELECT 1
   FROM public.plan p
  WHERE (((p.uid)::text = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))));



  create policy "メディアポリシー 1h7a3v3_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'medias'::text) AND (EXISTS ( SELECT 1
   FROM public.plan p
  WHERE (((p.uid)::text = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))));



  create policy "メディアポリシー 1h7a3v3_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'medias'::text) AND (EXISTS ( SELECT 1
   FROM public.plan p
  WHERE (((p.uid)::text = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))));



  create policy "メディアポリシー 1h7a3v3_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'medias'::text) AND (EXISTS ( SELECT 1
   FROM public.plan p
  WHERE (((p.uid)::text = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))));



  create policy "ユーザーは自分のアバター画像を作成できる"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND (name ~ similar_to_escape((auth.uid() || '_[0-9]+\.(jpg|jpeg|png|gif|webp)'::text)))));



  create policy "ユーザーは自分のアバター画像を削除できる 1o"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'avatars'::text) AND (name ~ similar_to_escape((auth.uid() || '_[0-9]+\.(jpg|jpeg|png|gif|webp)'::text)))));



