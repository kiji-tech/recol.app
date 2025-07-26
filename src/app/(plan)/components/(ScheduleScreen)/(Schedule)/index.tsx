import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { ReactNode, useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ScheduleItem from './ScheduleItem';
import dayjs from 'dayjs';
import { fetchScheduleList } from '@/src/libs/ApiService';
import { useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/contexts/AuthContext';
import Button from '@/src/components/Common/Button';
import { Place } from '@/src/entities/Place';
import { Schedule } from '@/src/entities/Plan';
import { Toast } from 'toastify-react-native';
import { LogUtil } from '@/src/libs/LogUtil';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
  onDelete?: (schedule: Tables<'schedule'>) => void;
};

export default function ScheduleComponents({ plan, onDelete }: Props): ReactNode {
  // === Member ===
  const DATE_FORMAT = 'YYYY-MM-DD';
  const { setEditSchedule } = usePlan();
  const { session } = useAuth();
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
  const router = useRouter();

  // === Method ====
  const handleAddSchedule = () => {
    // スケジュールリストの最後の日付(to)を設定する
    const from =
      scheduleList.length > 0
        ? dayjs(scheduleList[scheduleList.length - 1].to)
        : dayjs().set('minute', 0);
    const to = dayjs(from).add(1, 'hour');

    const newSchedule = {
      plan_id: plan!.uid,
      from: from.format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: to.format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Tables<'schedule'> & { place_list: Place[] };
    setEditSchedule(newSchedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
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
    <ScrollView showsVerticalScrollIndicator={false}>
      {scheduleList.map((schedule, index) => {
        const date = dayjs(schedule.from).format(DATE_FORMAT);
        let isDateView = true;
        let isEndDateView = true;

        if (index > 0 && date == dayjs(scheduleList[index - 1].from).format(DATE_FORMAT)) {
          isDateView = false;
        }

        if (
          index + 1 < scheduleList.length &&
          dayjs(schedule.to).isSame(dayjs(scheduleList[index + 1].from))
        ) {
          isEndDateView = false;
        }
        return (
          <View key={schedule.uid} className="relative">
            {isDateView && (
              <Text
                className={`font-bold text-xl text-center ${index != 0 && 'mt-4'} text-light-text dark:text-dark-text sticky top-0 mb-2`}
              >
                {date}
              </Text>
            )}
            <ScheduleItem
              item={schedule}
              isEndDateView={isEndDateView}
              onPress={handleSchedulePress}
              onLongPress={handleScheduleLongPress}
            />
          </View>
        );
      })}
      <View className="mt-8">
        <Button text="スケジュールを追加" onPress={() => handleAddSchedule()} />
      </View>
    </ScrollView>
  );
}
