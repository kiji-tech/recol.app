import { Plan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import { Place, fetchCachePlace } from '@/src/features/map';
import { Session } from '@supabase/supabase-js';
import dayjs from 'dayjs';
/**
 * スケジュールを共有のためのメッセージ（text）を作成する
 * @param plan {Plan} プラン
 * @returns {string} 共有メッセージ
 */
export const generateShareMessage = async (plan: Plan, session: Session | null) => {
  if (!session) return;
  const { schedule: scheduleList } = plan;
  let message = `【Re:CoL】${plan.title}
■■■メモ■■■
${plan.memo || ''}

■■■予定■■■
`;
  for (let schedule of scheduleList.sort((a, b) => dayjs(a.from).diff(dayjs(b.from)))) {
    const scheduleMessage = await generateScheduleMessage(schedule, session);
    message += scheduleMessage;
  }

  return (message += '\n---------------------------------------------').trim();
};

/**
 * スケジュールを共有のためのメッセージ（text）を作成する
 *
 * @param schedule {Schedule} スケジュール
 * @returns
 */
const generateScheduleMessage = async (schedule: Schedule, session: Session) => {
  // ToDo: place_listがstringなので､fetchするか､別途placeListを引数で取る
  const placeList = await fetchCachePlace(schedule.place_list || [], session);
  return `\n---------------------------------------------\n
- ${dayjs(schedule.from).format('YYYY/M/D H:mm')} 〜 ${dayjs(schedule.to).format('H:mm')}
- ${schedule.title || '(タイトル未設定)'}
- ${schedule.description || ''}
${(placeList && placeList.map((place: Place) => `●${place.displayName.text}\n${place.googleMapsUri}\n`).join('\n')) || ''}`;
};
