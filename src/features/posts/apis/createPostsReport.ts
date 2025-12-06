import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';
import { PostsReport } from '@/src/features/posts';

export async function createPostsReport(
  postsReport: PostsReport,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<PostsReport>('/v1/posts/report', {
    method: 'POST',
    session,
    body: { postsReport },
    ctrl,
  });
  return response.data!;
}
