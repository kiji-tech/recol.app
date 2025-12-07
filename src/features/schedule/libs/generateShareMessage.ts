import { Plan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
/**
 * スケジュールを共有のためのメッセージ（text）を作成する
 *
 * @param plan {Plan} プラン
 * @returns {string} 共有メッセージ
 */
export const generateShareMessage = (plan: Plan) => {
  const { schedule: scheduleList } = plan;
  const message = `【Re:CoL】${plan.title}
■■■メモ■■■
${plan.memo || ''}

■■■予定■■■
${scheduleList
  .sort((a, b) => dayjs(a.from).diff(dayjs(b.from)))
  .map((schedule) => generateScheduleMessage(schedule))
  .join('\n')}
---------------------------------------------
`;
  return message;
};

/**
 * スケジュールを共有のためのメッセージ（text）を作成する
 *
 * @param schedule {Schedule} スケジュール
 * @returns
 */
const generateScheduleMessage = (schedule: Schedule) => {
  // ToDo: place_listがstringなので､fetchするか､別途placeListを引数で取る
  return `---------------------------------------------
- ${dayjs(schedule.from).format('YYYY/M/D H:mm')} 〜 ${dayjs(schedule.to).format('H:mm')}
- ${schedule.title || '(タイトル未設定)'}
- ${schedule.description || ''}
${schedule.place_list?.map((place) => `●${place.displayName.text}\n${place.googleMapsUri}\n`).join('\n') || ''}`.trim();
};
