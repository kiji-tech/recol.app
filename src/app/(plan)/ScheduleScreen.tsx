import dayjs from 'dayjs';
import React, { ReactNode, useCallback, useState } from 'react';
import ScheduleComponents from '@/src/components/Schedule';
import { BackgroundView, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import { useRouter } from 'expo-router';
import { deleteSchedule, fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';
import { useAuth } from '@/src/contexts/AuthContext';
import { View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import PlanInformation from '@/src/components/PlanInformation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Plan, Schedule } from '@/src/entities/Plan';
import MaskLoading from '@/src/components/MaskLoading';
import ToastManager, { Toast } from 'toastify-react-native';
import { LogUtil } from '@/src/libs/LogUtil';

const ScheduleMenu = ({ plan }: { plan: Plan }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { setEditSchedule } = usePlan();

  // === Method ===
  /** プランの編集 */
  const handleEditPress = () => {
    router.push(`/(modal)/PlanEditor`);
  };

  /** スケジュールの追加 */
  const handleAddPress = () => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs().add(1, 'hour').set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Schedule;
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
              color: 'black',
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
              color: 'black',
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
  const { plan, planLoading } = usePlan();
  const { session } = useAuth();
  const [viewPlan, setViewPlan] = useState<Plan | null>(plan || null);

  // === Method ===
  const initView = () => {
    if (!session) {
      Toast.warn('ログイン情報が見つかりませんでした');
      router.navigate('/(auth)/SignIn');
      return;
    }

    if (!plan?.uid) {
      Toast.warn('プランの情報が取得できませんでした');
      router.back();
      return;
    }

    const ctrl = new AbortController();

    fetchPlan(plan.uid, session, ctrl)
      .then((data) => {
        if (!data) {
          Toast.warn('プランの情報が取得できませんでした');
        }
        setViewPlan({ ...data } as Plan);
      })
      .catch((e) => {
        if (e && e.message.includes('Aborted')) {
          LogUtil.log('Aborted', { level: 'info' });
          return;
        }
        LogUtil.log(JSON.stringify({ fetchPlan: e }), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn('プランの情報が取得に失敗しました');
        }
      });

    return () => {
      ctrl.abort();
    };
  };

  /** 予定の削除 */
  const handleDeleteSchedule = async (schedule: Tables<'schedule'>) => {
    deleteSchedule(schedule.uid, session)
      .then(() => {
        Toast.success(`${schedule.title} を削除しました`);
        initView();
      })
      .catch((e) => {
        LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn(e.message);
        }
      });
  };

  // === Effect ===
  useFocusEffect(useCallback(initView, [plan, session]));

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        title={`${viewPlan?.title || plan?.title || 'スケジュール'}の予定`}
        onBack={() => router.back()}
        rightComponent={viewPlan ? <ScheduleMenu plan={viewPlan} /> : undefined}
      />
      {/* Plan Information */}
      {viewPlan && (
        <>
          <PlanInformation plan={viewPlan} />
          {/* Schedule */}
          <ScheduleComponents plan={viewPlan} onDelete={handleDeleteSchedule} />
        </>
      )}
      {planLoading && <MaskLoading />}
      <ToastManager />
    </BackgroundView>
  );
}
