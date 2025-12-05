import { supabase } from '@/src/libs/supabase';

/**
 * 投稿一覧を取得する
 * @param option
 * @param ctrl
 * @returns
 */
export async function fetchPostsList(
  option: { offset?: number; limit?: number },
  ctrl?: AbortController
) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profile(*)')
    .eq('delete_flag', false)
    .range(option.offset || 0, (option.limit || 10) + (option.offset || 0))
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }

  return posts;
}
