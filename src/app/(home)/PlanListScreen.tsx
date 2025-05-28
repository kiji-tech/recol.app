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

type PlanWithSchedule = Tables<'plan'> & { schedule: Tables<'schedule'>[] };

export default function PlanListScreen() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { planList, setPlan, setPlanList } = usePlan();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // === Method ===
  const init = async (ctrl?: AbortController) => {
    setIsLoading(true);
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
    setPlanList(data as PlanWithSchedule[]);
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
          router.push('/(addPlan)/AddPlan');
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
      {/* プランがない場合 */}
      {planList.length === 0 && (
        <View className="flex flex-col justify-center items-center h-full">
          <Text className="text-light-text dark:text-dark-text text-lg font-bold">
            プランがありません
          </Text>
          <Button
            text={'プランを追加する'}
            theme={'info'}
            onPress={() => router.push('/(addPlan)/AddPlan')}
          />
        </View>
      )}
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start gap-4">
        {planList &&
          planList.map((p: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => (
            <TouchableOpacity
              key={p.uid}
              className={`
                py-4 w-full
                border-light-border dark:border-dark-border`}
              onPress={() => handleSelectPlan(p)}
            >
              <View className="flex flex-row gap-2 justify-between items-start">
                <View className="flex flex-row gap-4 justify-start items-center">
                  {/*  アイコン（TODO） */}
                  <View className="w-10 h-10 bg-light-info rounded-full"></View>
                  <View className="flex flex-col gap-2 justify-start items-start">
                    <Text className={`font-bold text-md text-light-text dark:text-dark-text`}>
                      {p.title}
                    </Text>
                    <Text className="text-light-text dark:text-dark-text text-xs"></Text>
                  </View>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className={`text-sm text-light-text dark:text-dark-text`}>
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
          ))}
      </View>
    </BackgroundView>
  );
}
