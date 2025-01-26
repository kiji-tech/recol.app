import { Tables } from '@/src/libs/database.types';
import { ReactNode, useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity } from 'react-native';
import ScheduleItem from './ScheduleItem';
import dayjs from 'dayjs';
import { fetchScheduleList } from '@/src/libs/ApiService';
import { useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

export default function TripCalendar({ plan }: Props): ReactNode {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const [schedule, setSchedule] = useState<Tables<'schedule'>[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Tables<'schedule'> | null>(null);
  const { setEditSchedule } = usePlan();
  const router = useRouter();
  // === Effect ===
  useEffect(() => {
    if (!plan) return;
    const ctrl = new AbortController();

    fetchScheduleList(plan.uid, ctrl).then((data) => {
      if (data) {
        setSchedule(data);
      }
    });

    return () => {
      ctrl.abort();
    };
  }, []);

  // === Method ====
  /** 時間軸クリックイベント */
  const handleHourPress = (hour: string) => {
    setEditSchedule({
      plan_id: plan!.uid,
      from: dayjs().set('hour', parseInt(hour)).set('minute', 0).format('YYYY-MM-DDTHH:mm:ss.000Z'),
      to: dayjs()
        .set('hour', parseInt(hour) + 1)
        .set('minute', 0)
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
    } as Tables<'schedule'>);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** アイテムクリックイベント */
  const handleSchedulePress = (schedule: Tables<'schedule'>) => {
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  // === Render ===
  return (
    <ScrollView className="w-full my-12">
      {/* 時間軸の表示 */}
      {hours.map((hour) => {
        // 時間内にあるスケジュールを取得する
        return (
          <TouchableOpacity
            key={hour}
            onPress={() => {
              handleHourPress(hour);
            }}
            className={`w-full flex flex-row items-center 
                border-t-[1px] last-child:border-b-[1px]  h-[40px]
                border-light-border dark:border-dark-border`}
          >
            <Text className="w-1/6 pl-2 text-light-text dark:text-dark-text">{hour}</Text>
          </TouchableOpacity>
        );
      })}
      {/* スケジュールアイテム（タスク）の表示 */}
      {schedule.map((s) => (
        <ScheduleItem
          key={s.uid}
          item={s}
          active={selectedSchedule ? selectedSchedule.uid == s.uid : false}
          onPress={handleSchedulePress}
        />
      ))}
    </ScrollView>
  );
}
