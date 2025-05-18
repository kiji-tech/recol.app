import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackgroundView, Button, Header, Loading } from '@/src/components';
import IconButton from '@/src/components/IconButton';
import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { fetchPlanList } from '@/src/libs/ApiService';
import { LogUtil } from '@/src/libs/LogUtil';
import { useTheme } from '@/src/contexts/ThemeContext';
import { AD_INTERVAL } from '@/src/libs/ConstValue';
import { MyBannerAd } from '@/src/components/Ad/BannerAd';

type PlanWithSchedule = Tables<'plan'> & { schedule: Tables<'schedule'>[] };

export default function PlanListScreen() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { setPlan } = usePlan();
  const { session } = useAuth();
  const [plans, setPlans] = useState<PlanWithSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // === Method ===
  const init = async (ctrl?: AbortController) => {
    setIsLoading(true);
    setPlans([]);
    LogUtil.log('planを取得します', { level: 'info' });
    const data = await fetchPlanList(session, ctrl).catch((e) => {
      LogUtil.log(e, { level: 'error', notify: true });
      if (e) {
        if ('Aborted'.indexOf(e.message) >= 0) {
          return [];
        }
        alert(e.message);
      }
    });
    setPlans((data as PlanWithSchedule[]) || []);
    setIsLoading(false);
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      const ctrl = new AbortController();
      init(ctrl);
      return () => {
        ctrl.abort();
      };
    }, [])
  );

  // === Method ===
  const addButton = () => {
    return (
      <IconButton
        icon={<MaterialIcons name="add" size={18} color={isDarkMode ? 'white' : 'black'} />}
        theme="info"
        onPress={() => {
          router.push('/(add.plan)/AddPlan');
        }}
      />
    );
  };

  const handleSelectPlan = (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => {
    // スケジュールを取得して設定
    setPlan(plan);
    router.push({
      pathname: '/(plan)/ScheduleScreen',
      params: {
        uid: plan.uid,
      },
    });
  };

  // === Render ===

  // プランがない場合
  if (isLoading) {
    return <Loading />;
  }

  return (
    <BackgroundView>
      <Header title="計画一覧" rightComponent={addButton()} />

      {plans.length === 0 && (
        <View className="flex flex-col justify-center items-center h-full">
          <Text className="text-light-text dark:text-dark-text text-lg font-bold">
            プランがありません
          </Text>
          <Button
            text={'プランを追加する'}
            theme={'info'}
            onPress={() => router.push('/(add.plan)/AddPlan')}
          />
        </View>
      )}

      <View className="flex flex-row justify-center flex-wrap gap-4 mb-4">
        {plans &&
          plans.map((p: Tables<'plan'> & { schedule: Tables<'schedule'>[] }, i: number) => (
            <View key={p.uid}>
              <TouchableOpacity
                className={`
                p-4 border-b-[1px] 
                w-full rounded-lg
                border-light-border dark:border-dark-border`}
                onPress={() => handleSelectPlan(p)}
              >
                <View className="flex flex-col gap-2 justify-start items-start">
                  <View className="flex flex-row justify-between items-center w-full">
                    <Text className={`font-bold text-xl text-light-text dark:text-dark-text`}>
                      {p.title}
                    </Text>
                    <Text className={`text-md text-light-text dark:text-dark-text`}>
                      {dayjs(p.from).format('M/D') != dayjs(p.to).format('M/D')
                        ? `${dayjs(p.from).format('M/D')} - ${dayjs(p.to).format('M/D')}`
                        : dayjs(p.from).format('M/D')}
                    </Text>
                  </View>
                  {/* TODO: メンバー */}
                  {/* <View className="flex flex-row justify-start items-center gap-2">
                  <View className={`h-8 w-8 bg-light-info rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-warn rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-danger rounded-full `}></View>
                  </View> */}
                </View>
              </TouchableOpacity>
              {i % AD_INTERVAL === 3 && <MyBannerAd />}
            </View>
          ))}
      </View>
    </BackgroundView>
  );
}
