import { Plan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import dayjs from '@/src/libs/dayjs';

/**
 * スケジュールAとスケジュールBが関連するかどうかを判定する
 * @param a {Schedule} スケジュールA
 * @param b {Schedule} スケジュールB
 * @returns {boolean} 関連するかどうか
 * @returns
 */
const isRelatedSchedule = (a: Schedule, b: Schedule) => {
  if (dayjs(a.to).diff(dayjs(b.from)) == 0 || dayjs(a.from).diff(dayjs(b.to)) == 0) {
    return true;
  }

  return false;
};

const findRelatedSchedule = (result: Schedule[], allSchedule: Schedule[]): Schedule[] => {
  /** まだresultに含まれていないスケジュールを取得 */
  const targetSchedule = allSchedule.filter((s) => !result.some((r) => s.uid == r.uid));
  if (targetSchedule.length == 0) {
    return result;
  }

  for (const s of targetSchedule) {
    if (isRelatedSchedule(result[0], s)) {
      result.push(s);
      findRelatedSchedule(result, allSchedule);
    }
  }
  return result;
};

/**
 * 変更したスケジュールに関連する､別のスケジュールを再帰的に取得する
 * @param plan {Plan} プラン
 * @param editSchedule {Schedule} 編集する予定
 * @returns {Schedule[]} 関連する予定
 */
const findRelatedScheduleList = (
  plan: Plan,
  editSchedule: Schedule,
  orgSchedule?: Schedule
): Schedule[] => {
  if (!orgSchedule) {
    return [];
  }
  const newScheduleList = plan.schedule!.filter((s) => s.uid != orgSchedule.uid);
  const result: Schedule[] = findRelatedSchedule([editSchedule], newScheduleList);
  return result.sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)));
};
export { findRelatedScheduleList };
