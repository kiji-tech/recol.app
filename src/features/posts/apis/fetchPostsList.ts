import { Posts } from '../types/Posts';

export async function fetchPostsList(
  option: { offset?: number; limit?: number },
  ctrl?: AbortController
) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/v1/posts/list`, {
    method: 'POST',
    body: JSON.stringify({ option }),
    headers: {
      'Content-Type': 'application/json',
    },
    signal: ctrl?.signal,
  });
  const data = await response.json();
  return data.map((item: any) => new Posts(item));
}
