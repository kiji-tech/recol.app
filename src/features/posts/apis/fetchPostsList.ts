import { Posts } from '../types/Posts';
import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

export async function fetchPostsList(
  option: { offset?: number; limit?: number },
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Posts[]>(`/v1/posts/list`, {
    method: 'POST',
    body: { option },
    session,
    ctrl,
  });
  return response.data!.map((item) => new Posts(item));
}
