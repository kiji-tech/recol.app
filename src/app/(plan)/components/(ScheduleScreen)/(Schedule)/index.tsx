import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { ReactNode, useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { fetchScheduleList } from '@/src/features/schedule';
import { useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/features/auth';
import { Plan } from '@/src/features/plan';
import { Place } from '@/src/entities/Place';
import { Schedule } from '@/src/features/schedule';
import { Toast } from 'toastify-react-native';
import { LogUtil } from '@/src/libs/LogUtil';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Button, IconButton } from '@/src/components';
import ScheduleItem from './ScheduleItem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import MaskLoading from '@/src/components/MaskLoading';

type Props = {
  plan: Plan | null;
  onDelete?: (schedule: Schedule) => void;
  isLoading?: boolean;
};

export default function ScheduleComponents({
  plan,
  onDelete,
  isLoading = false,
}: Props): ReactNode {
  // === Member ===
  const DATE_FORMAT = 'YYYY-MM-DD';
  const { setEditSchedule } = usePlan();
  const { session } = useAuth();
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
  const { isDarkMode } = useTheme();
  const router = useRouter();

  // === Method ====
  const onNewSchedule = (planId: string, from: dayjs.Dayjs, to: dayjs.Dayjs) => {
    const newSchedule = {
      plan_id: plan!.uid,
      from: from.format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: to.format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Tables<'schedule'> & { place_list: Place[] };
    setEditSchedule(newSchedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  const handleAddSchedule = () => {
    // スケジュールリストの最後の日付(to)を設定する
    const from =
      scheduleList.length > 0
        ? dayjs(scheduleList[scheduleList.length - 1].to)
        : dayjs().set('minute', 0);
    const to = dayjs(from).add(1, 'hour');
    onNewSchedule(plan!.uid, from, to);
  };

  /** 間のスケジュールから予定を追加する */
  const handleAddScheduleBetween = (schedule: Schedule) => {
    const from = dayjs(schedule.to);
    const to = dayjs(from).add(1, 'hour');
    onNewSchedule(plan!.uid, from, to);
  };

  /** アイテムクリックイベント */
  const handleSchedulePress = (schedule: Tables<'schedule'> & { place_list: Place[] }) => {
    const s = {
      ...schedule,
      plan_id: plan!.uid,
      from: dayjs(schedule.from)
        .set('hour', dayjs(schedule.from).get('hour'))
        .set('minute', dayjs(schedule.from).get('minute'))
        .format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs(schedule.to)
        .set('hour', dayjs(schedule.to).get('hour'))
        .set('minute', dayjs(schedule.to).get('minute'))
        .format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Tables<'schedule'> & { place_list: Place[] };
    setEditSchedule(s);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** アイテム長押しイベント */
  const handleScheduleLongPress = (schedule: Schedule) => {
    if (!onDelete) return;
    // 削除アラート
    Alert.alert(schedule.title!, 'このスケジュールを削除しますか？', [
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

  // === Effect ===
  useEffect(() => {
    if (!plan) return;
    const ctrl = new AbortController();

    fetchScheduleList(plan.uid, session, ctrl)
      .then((data) => {
        if (data) {
          setScheduleList(data.sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) as Schedule[]);
        }
      })
      .catch((e) => {
        if (e && e.message.includes('Aborted')) {
          LogUtil.log('Aborted', { level: 'info' });
          return;
        }
        LogUtil.log(JSON.stringify({ fetchScheduleList: e }), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn('スケジュールの取得に失敗しました');
        }
      });

    return () => {
      ctrl.abort();
    };
  }, [plan]);

  // ==== Memo ===

  // === Render ===
  return (
    <>
      <View className="bg-light-background dark:bg-dark-background rounded-xl">
        {scheduleList.map((schedule, index) => {
          const date = dayjs(schedule.from).format(DATE_FORMAT);
          const isDateView =
            index > 0 && date == dayjs(scheduleList[index - 1].from).format(DATE_FORMAT)
              ? false
              : true;
          const isEndDateView =
            index + 1 < scheduleList.length &&
            dayjs(schedule.to).isSame(dayjs(scheduleList[index + 1].from))
              ? false
              : true;

          return (
            <View key={schedule.uid} className="relative">
              {/* 日付 */}
              {isDateView && (
                <Text
                  className={`font-bold text-xl text-center text-light-text dark:text-dark-text sticky top-0 pt-4`}
                >
                  {date}
                </Text>
              )}

              {/* スケジュールの間から予定を追加する */}
              {index != 0 && scheduleList[index - 1].to != schedule.from && (
                <View className="w-full flex justify-center items-start my-4 ml-4">
                  <IconButton
                    theme="background"
                    icon={
                      <MaterialIcons name="add" size={18} color={isDarkMode ? 'white' : 'black'} />
                    }
                    onPress={() => handleAddScheduleBetween(scheduleList[index - 1])}
                  />
                </View>
              )}
              {/* スケジュール */}
              <ScheduleItem
                item={schedule}
                isEndDateView={isEndDateView}
                onPress={handleSchedulePress}
                onLongPress={handleScheduleLongPress}
              />
            </View>
          );
        })}
      </View>
      <View className="mt-8">
        <Button
          text="スケジュールを追加"
          disabled={isLoading}
          onPress={() => handleAddSchedule()}
        />
      </View>
      {isLoading && <MaskLoading />}
    </>
  );
}
