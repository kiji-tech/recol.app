import { Schedule } from '@/src/features/schedule';
import { Plan, PlanSortType } from '@/src/features/plan';
import dayjs from 'dayjs';

/**
 * プラン一覧をソートする
 * @param planList {Plan & { schedule: Schedule[] }[]} プラン一覧
 * @param sortType {PlanSortType} ソート条件
 * @returns {Plan & { schedule: Schedule[] }[]} ソートされたプラン一覧
 */
export const sortPlanSchedule = (
  planList: (Plan & { schedule: Schedule[] })[],
  sortType: PlanSortType
) => {
  // sortTypeがcreated_atの場合はそのままでよい
  if (sortType === 'created_at') return planList;

  // planごとにfromのmax値を使ってソートする
  const sortedPlanList = planList.sort((a, b) => {
    const aMaxFrom = a.schedule.reduce(
      (max, schedule) => (dayjs(schedule.from).isAfter(max) ? dayjs(schedule.from) : max),
      dayjs('0000-01-01')
    );
    const bMaxFrom = b.schedule.reduce(
      (max, schedule) => (dayjs(schedule.from).isAfter(max) ? dayjs(schedule.from) : max),
      dayjs('0000-01-01')
    );
    return dayjs(bMaxFrom).diff(dayjs(aMaxFrom));
  });

  return sortedPlanList;
};
