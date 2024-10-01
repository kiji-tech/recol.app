import { BackgroundView } from '@/src/components';
import IconButton from '@/src/components/IconButton';
import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Events() {
  const router = useRouter();
  const [plans, setPlans] = useState<Tables<'plan'>[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
      console.log({ data: res.data });
      setPlans(res.data);
    })();
  }, []);

  const addButton = () => {
    return (
      <TouchableOpacity>
        <View className="">
          <IconButton
            icon="add"
            onPress={() => {
              router.push('/(add.plan)/add.plan');
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
          {plans.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              className={`
                bg-gray-100
                dark:bg-gray-20
                shadow-lg
                p-4
                w-full rounded-lg`}
              onPress={() => {
                router.push({
                  pathname: '/(plan)/[id]/map',
                  params: {
                    id: p.id,
                  },
                });
              }}
            >
              <View className="flex flex-col gap-2 justify-start items-start">
                <View className="flex flex-row justify-between items-center w-full">
                  <Text className={`font-bold text-xl`}>{p.locations?.join(' ')}</Text>
                  <Text
                    className={`
                    text-md
                    text-gray-50 dark:text-gray-70
                    `}
                  >
                    {dayjs(p.from).format('M/D')} - {dayjs(p.to).format('M/D')}
                  </Text>
                </View>
                {/* TODO: メンバー */}
                <View className="flex flex-row justify-start items-center gap-2">
                  <View className={`h-8 w-8 bg-light-primary-base rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-secondary-base rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-warn-base rounded-full `}></View>
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
