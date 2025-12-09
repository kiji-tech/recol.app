import React, { useMemo } from 'react';
import { ReactNode } from 'react';
import { Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlan, useTheme } from '@/src/contexts';
import { Schedule, ScheduleItem } from '@/src/features/schedule';
import { Button, IconButton, MaskLoading } from '@/src/components';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  onDelete?: (schedule: Schedule) => void;
};

export default function ScheduleComponents({ onDelete }: Props): ReactNode {
  // === Member ===
  const DATE_FORMAT = 'YYYY-MM-DD';
  const { plan, planLoading: isLoading, setEditSchedule } = usePlan();
  const scheduleList = useMemo(() => {
    return plan?.schedule.sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) as Schedule[];
  }, [plan]);
  const { isDarkMode } = useTheme();
  const router = useRouter();

  // === Method ====
  /**
   * 新しいスケジュールを作成する
   * @param from {Dayjs} 開始日時
   * @param to {Dayjs} 終了日時
   */
  const onNewSchedule = (from: dayjs.Dayjs, to: dayjs.Dayjs) => {
    const newSchedule = new Schedule({
      plan_id: plan!.uid,
      from: from.format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: to.format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Schedule);
    setEditSchedule(newSchedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /**
   * 新しいスケジュールを追加する
   */
  const handleAddSchedule = () => {
    // スケジュールリストの最後の日付(to)を設定する
    const from =
      scheduleList.length > 0
        ? dayjs(scheduleList[scheduleList.length - 1].to)
        : dayjs().set('minute', 0);
    const to = dayjs(from).add(1, 'hour');
    onNewSchedule(from, to);
  };

  /**
   * 間のスケジュールから予定を追加する
   * @param schedule {Schedule} スケジュール
   */
  const handleAddScheduleBetween = (schedule: Schedule) => {
    const from = dayjs(schedule.to);
    const to = dayjs(from).add(1, 'hour');
    onNewSchedule(from, to);
  };

  /**
   * スケジュールアイテムを押した際のイベント
   * @param schedule {Schedule} スケジュール
   */
  const handleSchedulePress = (schedule: Schedule) => {
    const s = new Schedule({
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
    });
    setEditSchedule(s);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /**
   * スケジュールアイテムを長押しした際のイベント
   * @param schedule {Schedule} スケジュール
   */
  const handleScheduleLongPress = (schedule: Schedule) => {
    if (!onDelete) return;
    // 削除アラート
    const text = generateI18nMessage('FEATURE.SCHEDULE.DELETE_SUCCESS', [
      { key: 'title', value: schedule.title || '' },
    ]);
    Alert.alert(text, generateI18nMessage('FEATURE.SCHEDULE.DELETE_CONFIRM'), [
      { text: generateI18nMessage('COMMON.CANCEL'), style: 'cancel' },
      {
        text: generateI18nMessage('COMMON.DELETE'),
        style: 'destructive',
        onPress: () => {
          // 削除処理
          onDelete(schedule);
        },
      },
    ]);
  };

  // === Effect ===

  // ==== Memo ===

  // === Render ===
  return (
    <>
      <View className="bg-light-background dark:bg-dark-background rounded-xl ">
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
      <View className="my-8">
        <Button
          text={generateI18nMessage('FEATURE.SCHEDULE.ADD_SCHEDULE')}
          disabled={isLoading}
          onPress={() => handleAddSchedule()}
        />
      </View>
      {isLoading && <MaskLoading />}
    </>
  );
}
