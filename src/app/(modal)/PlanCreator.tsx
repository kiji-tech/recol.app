import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useAuth } from '@/src/contexts/AuthContext';
import { usePlan } from '@/src/contexts/PlanContext';
import { ApiErrorResponse, createPlan } from '@/src/libs/ApiService';
import { Tables } from '@/src/libs/database.types';

export default function PlanCreator() {
  // === Member ===
  const [title, setTitle] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session } = useAuth();
  const { fetchPlan } = usePlan();
  const router = useRouter();

  // === Method ===
  /** 登録 */
  const handlerSubmit = async () => {
    setIsLoading(true);
    createPlan({ title, memo } as Tables<'plan'>, session)
      .then(async () => {
        // リストを再取得しておく
        await fetchPlan();
        // 一覧に戻る
        router.back();
      })
      .catch((e: ApiErrorResponse) => {
        console.log(e);
        if (e && e.message) {
          Alert.alert(e.message);
        }
        if (e.code.startsWith('PP')) {
          router.push('/(payment)/PaymentPlan');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
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
          editable={!isLoading}
        />
      </View>
      <View className="w-full flex flex-col justify-start items-start">
        <Text className="text-lg font-bold text-light-text dark:text-dark-text">メモ</Text>
        <TextInput
          multiline={true}
          placeholder="メモを入力してください｡"
          placeholderTextColor="gray"
          className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
                        border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
          onChangeText={(text) => setMemo(text)}
        />
      </View>

      <View>
        <Text className="text-lg font-bold text-light-text dark:text-dark-text">
          友達を追加する
        </Text>
        <Button
          theme="info"
          text="選択"
          onPress={() => alert('準備中')}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
      <View className="w-full justify-center">
        <Button
          theme="theme"
          text="登録する"
          onPress={handlerSubmit}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </BackgroundView>
  );
}
