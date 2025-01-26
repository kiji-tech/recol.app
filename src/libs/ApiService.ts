const fetchSchedule = async (planId: string, ctrl?: AbortController) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/${planId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: ctrl?.signal,
  });
  if (!res.ok) {
    alert('スケジュールの取得に失敗しました');
    return;
  }
  const data = await res.json();
  return data;
};

export { fetchSchedule };
