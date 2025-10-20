import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useAuth } from '@/src/features/auth';
import { usePlan } from '@/src/contexts/PlanContext';
import { ApiErrorResponse } from '@/src/features/commons/apiService';
import { createPlan } from '@/src/features/plan';
import { Plan } from '@/src/features/plan/types/Plan';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';

export default function PlanCreator() {
  // === Member ===
  const [title, setTitle] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session } = useAuth();
  const { fetchPlan } = usePlan();
  const router = useRouter();

  // === Method ===
  const verify = () => {
    if (!title) {
      Toast.warn('計画の題目を入力してください');
      return false;
    }
    return true;
  };
  /** 登録 */
  const handlerSubmit = async () => {
    if (!verify()) return;
    setIsLoading(true);
    createPlan({ title, memo } as Plan, session)
      .then(async () => {
        await fetchPlan();
        Toast.success(`${title} を登録しました`);
        router.back();
      })
      .catch((e: ApiErrorResponse) => {
        LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
        if (e && e.message) {
          Alert.alert('プランの登録に失敗しました', e.message);
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
          editable={!isLoading}
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
      <ToastManager />
    </BackgroundView>
  );
}
