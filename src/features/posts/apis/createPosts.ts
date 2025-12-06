import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Posts } from '@/src/features/posts';

export async function createPosts(posts: Posts, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Posts>('/v1/posts', {
    method: 'POST',
    session,
    body: { posts },
    ctrl,
  });
  return response.data!;
}
