import React, { useState } from 'react';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { router } from 'expo-router';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { usePlan } from '@/src/contexts/PlanContext';

export default function AddPlan() {
  // === Member ===
  const [title, setTitle] = useState<string>('');
  const { session } = useAuth();
  const { fetchPlan } = usePlan();

  // === Method ===
  /** 登録 */
  const handlerSubmit = async () => {
    const body = JSON.stringify({
      title,
    });
    const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan', {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.ok) {
      // リストを再取得しておく
      await fetchPlan();
      // 一覧に戻る
      router.back();
    } else {
      alert(JSON.stringify(await res.json()));
    }
  };

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
            placeholder="◯◯のお茶会..."
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
            onChangeText={(text) => setTitle(text)}
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
