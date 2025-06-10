import dayjs from 'dayjs';
import React, { ReactNode, useCallback, useState } from 'react';
import Schedule from '@/src/components/Schedule';
import { BackgroundView, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import { useRouter } from 'expo-router';
import { deleteSchedule, fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Alert, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import PlanInformation from '@/src/components/PlanInformation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { LogUtil } from '@/src/libs/LogUtil';

const ScheduleMenu = (plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { setEditSchedule } = usePlan();

  // === Method ===
  /** プランの編集 */
  const handleEditPress = () => {
    router.push(`/(planEditor)/PlanEditor`);
  };

  /** スケジュールの追加 */
  const handleAddPress = () => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs().add(1, 'hour').set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Tables<'schedule'>;
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };
  return (
    <Menu>
      <MenuTrigger>
        <View className="w-10 h-10 bg-light-info dark:bg-dark-info rounded-full flex flex-row items-center justify-center">
          <SimpleLineIcons name="options" size={14} color={isDarkMode ? 'white' : 'black'} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderStartStartRadius: 10,
            borderStartEndRadius: 10,
            borderEndStartRadius: 10,
            borderEndEndRadius: 10,
            width: 140,
          },
        }}
      >
        <MenuOption
          text="プラン編集"
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
            },
          }}
          onSelect={handleEditPress}
        />
        <MenuOption
          text="スケジュール追加"
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
            },
          }}
          onSelect={() => {
            handleAddPress();
          }}
        />
      </MenuOptions>
    </Menu>
  );
};

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { plan } = usePlan();
  const { session } = useAuth();
  const [viewPlan, setViewPlan] = useState<
    (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null
  >(null);

  // === Method ===
  const initView = () => {
    if (!plan?.uid || !session) {
      Alert.alert('エラー', 'プランの情報が取得できませんでした。');
      router.back();
      return;
    }

    setViewPlan(null);
    const ctrl = new AbortController();

    fetchPlan(plan.uid, session, ctrl)
      .then((data) => {
        if (!data) {
          throw new Error('プランデータの取得に失敗しました');
        }
        setViewPlan({ ...data } as Tables<'plan'> & { schedule: Tables<'schedule'>[] });
      })
      .catch((error) => {
        if (error) {
          LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
          Alert.alert(
            'エラー',
            'プランの読み込み中にエラーが発生しました。もう一度お試しください。'
          );
        }
      });

    return () => {
      ctrl.abort();
    };
  };

  /** 予定の削除 */
  const handleDeleteSchedule = async (schedule: Tables<'schedule'>) => {
    try {
      if (!session) {
        throw new Error('セッションが無効です');
      }
      await deleteSchedule(schedule.uid, session);
      initView();
    } catch (error) {
      if (error)
        Alert.alert(
          'エラー',
          'スケジュールの削除中にエラーが発生しました。もう一度お試しください。'
        );
    }
  };

  // === Effect ===
  useFocusEffect(useCallback(initView, [plan, session]));

  if (!viewPlan) return <></>;

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        title={`${viewPlan?.title || plan?.title || 'スケジュール'}の予定`}
        onBack={() => router.back()}
        rightComponent={viewPlan ? <ScheduleMenu {...viewPlan} /> : undefined}
      />
      {/* Plan Information */}
      <PlanInformation plan={viewPlan} />
      {/* Schedule */}
      <Schedule plan={viewPlan} onDelete={handleDeleteSchedule} />
    </BackgroundView>
  );
}
