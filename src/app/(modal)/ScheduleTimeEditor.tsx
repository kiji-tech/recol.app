import React, { useState } from 'react';
import { BackgroundView, DatePicker, Header, Button, MaskLoading } from '@/src/components';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { usePlan, useTheme } from '@/src/contexts';
import {
  Schedule,
  CategoryIcon,
  adjustEndAtWhenReversed,
  adjustStartAtWhenNormal,
} from '@/src/features/schedule';
import { Plan, updatePlan } from '@/src/features/plan';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { Toast } from 'toastify-react-native';
import { useMutation } from 'react-query';
import dayjs from '@/src/libs/dayjs';
import generateI18nMessage from '@/src/libs/i18n';

const ScheduleTimeEditorItem = ({
  item,
  previousSchedule,
  nextSchedule,
  onChange,
}: {
  item: Schedule;
  previousSchedule?: Schedule;
  nextSchedule?: Schedule;
  onChange: (item: Schedule) => void;
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="flex flex-col justify-start items-start p-4  gap-2">
      {/* 予定タイトル・カテゴリ */}
      <View className="flex flex-row justify-start items-center gap-2">
        <CategoryIcon schedule={item} isDarkMode={isDarkMode} />
        <Text className="text-light-text dark:text-dark-text text-sm">{item.title}</Text>
      </View>
      <View className="flex flex-row justify-between items-center w-full gap-2">
        {!previousSchedule ? (
          <View className="w-10"></View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (previousSchedule) {
                const { from, to } = adjustEndAtWhenReversed(previousSchedule.to!, item.to!);
                onChange({
                  ...item,
                  from,
                  to,
                });
              }
            }}
          >
            <Text className="text-light-text dark:text-dark-text text-sm px-2 py-1">
              {generateI18nMessage('FEATURE.SCHEDULE.TIME_EDITOR.PREVIOUS_START_TIME')}
            </Text>
          </TouchableOpacity>
        )}
        {nextSchedule && (
          <TouchableOpacity
            onPress={() => {
              if (nextSchedule) {
                const { from, to } = adjustStartAtWhenNormal(item.from!, nextSchedule.from!);
                onChange({
                  ...item,
                  from,
                  to,
                });
              }
            }}
          >
            <Text className="text-light-text dark:text-dark-text text-sm px-2 py-1">
              {generateI18nMessage('FEATURE.SCHEDULE.TIME_EDITOR.NEXT_START_TIME')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* 日時 */}
      <View className="flex flex-row justify-between items-center w-full gap-2">
        <DatePicker
          mode="datetime"
          value={dayjs(item.from)}
          onChange={(date) => {
            const { from, to } = adjustEndAtWhenReversed(
              date.format('YYYY-MM-DDTHH:mm:00.000Z'),
              item.to!
            );
            onChange({ ...item, from, to });
          }}
        />
        <Text className="text-light-text dark:text-dark-text"> ― </Text>
        <DatePicker
          mode="datetime"
          value={dayjs(item.to)}
          onChange={(date) => {
            const { from, to } = adjustStartAtWhenNormal(
              item.from!,
              date.format('YYYY-MM-DDTHH:mm:00.000Z')
            );
            onChange({ ...item, from, to });
          }}
        />
      </View>
    </View>
  );
};

/**
 * 時間をまとめて編集画面
 * プランに紐づくスケジュールの時間をまとめて編集する
 * @returns {React.ReactNode}
 */
export default function ScheduleTimeEditor() {
  // === Member ===
  const { plan } = usePlan();
  const { session, user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>({
    ...plan,
    schedule: plan?.schedule
      ? plan?.schedule.sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)))
      : [],
  } as Plan);
  const { mutate, isLoading } = useMutation({
    mutationFn: () => updatePlan(currentPlan!, session),
    onSuccess: () => {
      router.back();
    },
    onError: (e) => {
      LogUtil.log(JSON.stringify({ scheduleTimeEditorError: e }), {
        user,
        level: 'error',
        notify: true,
      });
      Toast.warn(generateI18nMessage('FEATURE.SCHEDULE.TIME_EDITOR.SUBMIT_ERROR'));
    },
  });

  // === Method ===
  /**
   * スケジュールを変更する
   * @param item {Schedule} スケジュール
   */
  const handleChangeSchedule = (item: Schedule) => {
    setCurrentPlan({
      ...currentPlan,
      schedule: currentPlan?.schedule.map((s: Schedule) => (s.uid == item.uid ? item : s)),
    } as Plan);
  };

  return (
    <>
      <BackgroundView>
        <Header title="時間をまとめて編集" onBack={() => router.back()} />
        <View className="flex-1">
          <FlatList
            data={currentPlan?.schedule}
            renderItem={({ item, index }) => (
              <ScheduleTimeEditorItem
                item={item}
                onChange={handleChangeSchedule}
                previousSchedule={index > 0 ? currentPlan?.schedule[index - 1] : undefined}
                nextSchedule={
                  index < (currentPlan?.schedule.length ?? 0) - 1
                    ? currentPlan?.schedule[index + 1]
                    : undefined
                }
              />
            )}
            keyExtractor={(item) => item.uid!}
            showsVerticalScrollIndicator={false}
          />
          {isLoading && <MaskLoading />}
        </View>
        <View className="my-4">
          <Button
            text={generateI18nMessage('COMMON.SAVE')}
            onPress={mutate}
            disabled={isLoading}
            loading={isLoading}
            theme="theme"
          />
        </View>
      </BackgroundView>
    </>
  );
}
