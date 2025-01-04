import { BackgroundView } from '@/src/components';
import IconButton from '@/src/components/IconButton';
import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import { bgFormColor } from '@/src/themes/ColorUtil';

export default function Events() {
  const router = useRouter();
  const [plans, setPlans] = useState<Tables<'plan'>[]>([]);
  const { setPlan } = usePlan();
  useEffect(() => {
    (async () => {
      const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
      setPlans(res.data);
    })();
  }, []);

  const addButton = () => {
    return (
      <TouchableOpacity>
        <View>
          <IconButton
            icon="add"
            onPress={() => {
              router.push('/(add.plan)/AddPlan');
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

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
          {plans.map((p) => (
            <TouchableOpacity
              key={p.uid}
              className={`
                ${bgFormColor()}
                p-4
                w-full rounded-lg`}
              onPress={() => {
                setPlan(p);
                router.push({
                  pathname: '/(plan)/MapScreen',
                  params: {
                    uid: p.uid,
                  },
                });
              }}
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
