import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackgroundView, Loading } from '@/src/components';
import IconButton from '@/src/components/IconButton';
import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { fetchPlanList } from '@/src/libs/ApiService';

type PlanWithSchedule = Tables<'plan'> & { schedule: Tables<'schedule'>[] };

export default function PlanListScreen() {
  // === Member ===
  const router = useRouter();
  const { setPlan } = usePlan();
  const { session } = useAuth();
  const [plans, setPlans] = useState<PlanWithSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setPlans([]);
      const ctrl = new AbortController();
      fetchPlanList(session, ctrl).then((data: unknown) => {
        if (!data) return;
        setPlans(data as PlanWithSchedule[]);
        setIsLoading(false);
      });
      return () => {
        ctrl.abort();
      };
    }, [])
  );

  // === Method ===
  const addButton = () => {
    return (
      <TouchableOpacity>
        <View>
          <IconButton
            icon={
              <MaterialIcons
                name="add"
                size={18}
                className={`text-light-text dark:text-dark-text`}
                color="#000"
              />
            }
            onPress={() => {
              router.push('/(add.plan)/AddPlan');
            }}
          />
        </View>
      </TouchableOpacity>
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
  if (plans.length === 0) {
    return (
      <SafeAreaView>
        <BackgroundView>
          <Text className="text-lg text-gray-0 dark:text-gray-100 font-bold">No plans</Text>
          {addButton()}
        </BackgroundView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <BackgroundView>
        <View className="flex flex-row justify-center flex-wrap gap-4 mb-4">
            {isLoading && <Loading />}
          {plans &&
            plans.map((p : Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => (
              <TouchableOpacity
                key={p.uid}
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
                      {dayjs(p.from).format('M/D')} - {dayjs(p.to).format('M/D')}
                    </Text>
                  </View>
                  {/* TODO: メンバー */}
                  <View className="flex flex-row justify-start items-center gap-2">
                    <View className={`h-8 w-8 bg-light-info rounded-full `}></View>
                    <View className={`h-8 w-8 bg-light-warn rounded-full `}></View>
                    <View className={`h-8 w-8 bg-light-danger rounded-full `}></View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
        {addButton()}
      </BackgroundView>
    </SafeAreaView>
  );
}
