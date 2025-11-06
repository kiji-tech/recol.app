import React, { useState } from 'react';
import { BackgroundView, DatePicker, Header } from '@/src/components';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { Schedule } from '@/src/features/schedule';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Button } from '@/src/components';
import { Plan, updatePlan } from '@/src/features/plan';
import CategoryIcon from '@/src/features/schedule/components/CategoryIcon';
import dayjs from '@/src/libs/dayjs';
import { useAuth } from '@/src/features/auth';
import {
  adjustEndAtWhenReversed,
  adjustStartAtWhenNormal,
} from '@/src/features/schedule/libs/scheduleTime';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';
import MaskLoading from '@/src/components/MaskLoading';

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
    <View className="flex flex-col justify-start items-start p-4 border-b border-light-border dark:border-dark-border gap-2">
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
              前から開始時刻を設定
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
              次の開始時刻を設定
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
  const { session } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>({
    ...plan,
    schedule: plan?.schedule
      ? plan?.schedule.sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)))
      : [],
  } as Plan);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  /**
   * currentPlanのスケジュールを保存する
   */
  const handleSave = () => {
    if (!currentPlan) return;
    setIsLoading(true);
    updatePlan(currentPlan, session)
      .then(() => {
        router.back();
      })
      .catch((e) => {
        if (e && e.message) {
          LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
          Toast.warn(e.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <BackgroundView>
        <Header title="時間をまとめて編集" onBack={() => router.back()} />
        <View className="flex-1 max-h-[80%]">
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
            keyExtractor={(item) => item.uid}
            showsVerticalScrollIndicator={false}
          />
          {isLoading && <MaskLoading />}
        </View>
        <Button
          text="保存"
          onPress={() => handleSave()}
          disabled={isLoading}
          loading={isLoading}
          theme="theme"
        />
      </BackgroundView>
      <ToastManager />
    </>
  );
}
