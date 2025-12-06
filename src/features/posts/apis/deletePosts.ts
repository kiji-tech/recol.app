import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Posts } from '@/src/features/posts';

export async function deletePosts(posts: Posts, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest('/v1/posts/delete', {
    method: 'POST',
    session,
    body: { posts },
    ctrl,
  });
  return response.data;
}
