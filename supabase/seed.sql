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

--- Functions ---
