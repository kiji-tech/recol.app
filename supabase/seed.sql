-- バケットポリシー ---
-- バケット名: caches
-- ロール: authenticated
-- 操作: SELECT, INSERT, UPDATE, DELETE
-- 許可条件: bucket_id = 'caches'
create policy "policy_caches_bucket_select"
    on storage.objects 
    for SELECT
    using ( bucket_id = 'caches' );

create  policy "policy_caches_bucket_insert"
    on storage.objects 
    for INSERT
    with check ( bucket_id = 'caches' );

create policy "policy_caches_bucket_delete"
    on storage.objects 
    for DELETE
    using ( bucket_id = 'caches' );

create  policy "policy_caches_bucket_update"
    on storage.objects 
    for UPDATE
    with check ( bucket_id = 'caches' );

-- バケット名: medias
-- ロール: authenticated
-- 操作: SELECT, INSERT, UPDATE, DELETE
-- 許可条件: bucket_id = 'medias'
create policy "policy_medias_bucket_select"
    on storage.objects 
    for SELECT
    using ((bucket_id = 'medias') 
    and 
        (EXISTS ( SELECT 1 FROM plan p WHERE (((p.uid::text) = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))
    );

create  policy "policy_medias_bucket_insert"
    on storage.objects 
    for INSERT
    with check (( bucket_id = 'medias' )
    and 
        (EXISTS ( SELECT 1 FROM plan p WHERE (((p.uid::text) = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))
    );

create policy "policy_medias_bucket_delete"
    on storage.objects 
    for DELETE
    using ((bucket_id = 'medias') 
    and 
        (EXISTS ( SELECT 1 FROM plan p WHERE (((p.uid::text) = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))
    );

create  policy "policy_medias_bucket_update"
    on storage.objects 
    for UPDATE
    with check (( bucket_id = 'medias' )
    and 
        (EXISTS ( SELECT 1 FROM plan p WHERE (((p.uid::text) = (storage.foldername(objects.name))[1]) AND (p.user_id = auth.uid()))))
    );

-- バケット名: avatars  
-- ロール: authenticated
-- 操作: SELECT, INSERT, UPDATE, DELETE
-- 許可条件: bucket_id = 'avatars'
create policy "policy_avatars_bucket_select"
    on storage.objects 
    for SELECT
    using ( bucket_id = 'avatars' );

create  policy "policy_avatars_bucket_insert"
    on storage.objects 
    for INSERT
    with check ((bucket_id = 'avatars') AND (name ~ similar_to_escape((select auth.uid()) || '_[0-9]+\.(jpg|jpeg|png|gif|webp)'::text)));

create policy "policy_avatars_bucket_delete"
    on storage.objects 
    for DELETE
    using ((bucket_id = 'avatars') AND (name ~ similar_to_escape((select auth.uid()) || '_[0-9]+\.(jpg|jpeg|png|gif|webp)'::text)));

create  policy "policy_avatars_bucket_update"
    on storage.objects 
    for UPDATE
    with check ((bucket_id = 'avatars') AND (name ~ similar_to_escape((select auth.uid()) || '_[0-9]+\.(jpg|jpeg|png|gif|webp)'::text)));


--- Functions ---
