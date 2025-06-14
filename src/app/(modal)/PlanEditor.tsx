import React from 'react';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/src/contexts/AuthContext';
import { usePlan } from '@/src/contexts/PlanContext';
import { Tables } from '@/src/libs/database.types';
import { updatePlan } from '@/src/libs/ApiService';

export default function PlanEditor() {
  // === Member ===
  const { plan, setPlan } = usePlan();
  const { session } = useAuth();
  const router = useRouter();

  // === Method ===
  /** 登録 */
  const handlerSubmit = async () => {
    updatePlan(plan!, session)
      .then(() => {
        router.back();
      })
      .catch((e) => {
        alert(e);
      });
  };

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // === Render ===
  if (!plan) {
    Alert.alert('プランが見つかりません');
    router.back();
  }

  return (
    <ScrollView>
      <BackgroundView>
        <Header
          title="新しい計画を作成する"
          onBack={() => {
            router.back();
          }}
        />
        {/* タイトル */}
        <View className="w-full flex flex-col justify-start items-start">
          <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
            計画の題目を入力してください｡
          </Text>
          <TextInput
            value={plan?.title || ''}
            placeholder="◯◯のお茶会..."
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
            onChangeText={(text) =>
              setPlan({ ...plan, title: text } as Tables<'plan'> & {
                schedule: Tables<'schedule'>[];
              })
            }
          />
        </View>
        <View className="w-full flex flex-col justify-start items-start">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">メモ</Text>
          <TextInput
            value={plan?.memo || ''}
            multiline={true}
            placeholder="メモを入力してください｡"
            placeholderTextColor="gray"
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
                        border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) =>
              setPlan({ ...plan, memo: text } as Tables<'plan'> & {
                schedule: Tables<'schedule'>[];
              })
            }
          />
        </View>
        <View>
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            友達を追加する
          </Text>
          <Button theme="info" text="選択" onPress={() => alert('準備中')} />
        </View>
        <View className="w-full justify-center">
          <Button theme="theme" text="登録する" onPress={handlerSubmit} />
        </View>
      </BackgroundView>
    </ScrollView>
  );
}
