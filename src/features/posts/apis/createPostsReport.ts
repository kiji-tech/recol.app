import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';
import { PostsReports } from '../types/PostsReports';

export async function createPostsReport(
  postsReports: PostsReports,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<PostsReports>('/v1/posts/report', {
    method: 'POST',
    session,
    body: { postsReports },
    ctrl,
  });
  return response.data!;
}
