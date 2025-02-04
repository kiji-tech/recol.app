import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { ReactNode, useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import ScheduleItem from './ScheduleItem';
import dayjs from 'dayjs';
import { fetchScheduleList } from '@/src/libs/ApiService';
import { useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/contexts/AuthContext';
import Loading from '../Loading';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

export default function TripCalendar({ plan }: Props): ReactNode {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const { setEditSchedule } = usePlan();
  const { session } = useAuth();
  const [schedule, setSchedule] = useState<Tables<'schedule'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // === Effect ===
  useEffect(() => {
    if (!plan) return;

    setIsLoading(true);
    const ctrl = new AbortController();

    fetchScheduleList(plan.uid, session, ctrl).then((data) => {
      if (data) {
        setSchedule(data);
      }
      setIsLoading(false);
    });

    return () => {
      ctrl.abort();
    };
  }, []);

  // === Method ====
  /** 時間軸クリックイベント */
  const handleHourPress = (hour: string) => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('hour', parseInt(hour)).set('minute', 0).format('YYYY-MM-DDTHH:mm:ss.000Z'),
      to: dayjs()
        .set('hour', parseInt(hour) + 1)
        .set('minute', 0)
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
    } as Tables<'schedule'>;
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** アイテムクリックイベント */
  const handleSchedulePress = (schedule: Tables<'schedule'>) => {
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  // === Render ===
  return (
    <ScrollView className="w-full my-4">
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
                border-t-[1px] last-child:border-b-[1px]  h-[64px]
                border-light-border dark:border-dark-border`}
          >
            <Text className="w-1/6 pl-2 text-light-text dark:text-dark-text">{hour}</Text>
          </TouchableOpacity>
        );
      })}
      {/* スケジュールアイテム（タスク）の表示 */}
      <View className="absolute w-full h-full">{isLoading && <Loading />}</View>
      {schedule.map((s) => (
        <ScheduleItem key={s.uid} item={s} onPress={handleSchedulePress} />
      ))}
    </ScrollView>
  );
}
