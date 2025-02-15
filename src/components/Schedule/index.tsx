import React, { useMemo } from 'react';
import { Tables } from '@/src/libs/database.types';
import { ReactNode, useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import ScheduleItem from './ScheduleItem';
import dayjs from 'dayjs';
import { fetchScheduleList } from '@/src/libs/ApiService';
import { useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/contexts/AuthContext';
import Loading from '../Loading';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
  onDelete?: (schedule: Tables<'schedule'>) => void;
};

export default function Schedule({ plan, onDelete }: Props): ReactNode {
  // === Member ===
  const DATE_FORMAT = 'YYYY-MM-DD';
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const { setEditSchedule } = usePlan();
  const { session } = useAuth();
  const [schedule, setSchedule] = useState<Tables<'schedule'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const router = useRouter();
  // === Method ====
  /** 時間軸クリックイベント */
  const handleHourPress = (hour: string) => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs(selectedDate)
        .set('hour', parseInt(hour))
        .set('minute', 0)
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
      to: dayjs(selectedDate)
        .set('hour', parseInt(hour) + 1)
        .set('minute', 0)
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
    } as Tables<'schedule'>;
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** アイテムクリックイベント */
  const handleSchedulePress = (schedule: Tables<'schedule'>) => {
    const s = {
      ...schedule,
      plan_id: plan!.uid,
      from: dayjs(selectedDate)
        .set('hour', dayjs(schedule.from).get('hour'))
        .set('minute', dayjs(schedule.from).get('minute'))
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
      to: dayjs(selectedDate)
        .set('hour', dayjs(schedule.to).get('hour'))
        .set('minute', dayjs(schedule.to).get('minute'))
        .format('YYYY-MM-DDTHH:mm:ss.000Z'),
    } as Tables<'schedule'>;
    setEditSchedule(s);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** アイテム長押しイベント */
  const handleScheduleLongPress = (schedule: Tables<'schedule'>) => {
    if (!onDelete) return;
    // 削除アラート
    Alert.alert('削除', 'このスケジュールを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          // 削除処理
          onDelete(schedule);
        },
      },
    ]);
  };

  /** 日付クリックイベント */
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  // === Effect ===
  useEffect(() => {
    if (!plan) return;
    setSelectedDate(dayjs(plan.from));
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
  }, [plan]);

  // ==== Memo ===
  const dateList = useMemo(() => {
    if (!plan) return [];
    console.log('create date');
    const list = [];
    let targetAt = dayjs(plan.from);
    const endAt = dayjs(plan.to);
    while (targetAt.diff(endAt) <= 0) {
      list.push(targetAt);
      targetAt = targetAt.add(1, 'day');
    }
    return list;
  }, [plan]);

  if (!plan) return;

  // === Render ===
  return (
    <>
      {/* 日付選択タブ */}
      <View className="h-4/5">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {dateList.map((date, index) => {
            return (
              <TouchableOpacity
                key={date.format(DATE_FORMAT)}
                onPress={() => handleDatePress(date)}
              >
                <View
                  className={`border-t-[1px] border-x-[1px] 
                    flex justify-start items-start h-20 w-32 p-2 ${index == 0 && 'rounded-l-xl'} ${index === dateList.length - 1 && 'rounded-r-xl'}
                    border-light-border dark:border-dark-border ${date.isSame(selectedDate) ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'}`}
                >
                  <Text className="text-center font-semibold text-light-text dark:text-dark-text">
                    {date.format('M/D')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* 日付の予定 */}
        <ScrollView className="w-full">
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

          {schedule
            .filter((s) => dayjs(s.from).format(DATE_FORMAT) === selectedDate?.format(DATE_FORMAT))
            .map((s) => (
              <ScheduleItem
                key={s.uid}
                item={s}
                onPress={handleSchedulePress}
                onLongPress={handleScheduleLongPress}
              />
            ))}
          {isLoading && (
            <View className="absolute w-screen h-full top-0 left-0">
              <Loading />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
