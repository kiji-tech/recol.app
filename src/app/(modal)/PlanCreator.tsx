import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useAuth } from '@/src/features/auth';
import { createPlan } from '@/src/features/plan';
import { Plan } from '@/src/features/plan/types/Plan';
import { Toast } from 'toastify-react-native';
import i18n from '@/src/libs/i18n';
import { useMutation } from 'react-query';

export default function PlanCreator() {
  // === Member ===
  const [title, setTitle] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const { session } = useAuth();
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: (newPlan: Plan) => createPlan(newPlan, session),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        Toast.warn(error.message);
      }
    },
  });

  // === Method ===
  const verify = () => {
    if (!title) {
      Toast.warn(i18n.t('SCREEN.PLAN.TITLE_REQUIRED'));
      return false;
    }
    return true;
  };

  /** 登録 */
  const handlerSubmit = async () => {
    if (!verify()) return;
    mutate({ title, memo } as Plan);
  };

  return (
    <BackgroundView>
      <Header
        title={i18n.t('SCREEN.PLAN.CREATE_TITLE')}
        onBack={() => {
          router.back();
        }}
      />
      {/* タイトル */}
      <View className="w-full flex flex-col justify-start items-start gap-4">
        <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
          {i18n.t('SCREEN.PLAN.TITLE_LABEL')}
        </Text>
        <TextInput
          placeholder={i18n.t('SCREEN.PLAN.TITLE_PLACEHOLDER')}
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={(text) => setTitle(text)}
          editable={!isLoading}
        />
        <View className="w-full flex flex-col justify-start items-start">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            {i18n.t('SCREEN.PLAN.MEMO_LABEL')}
          </Text>
          <TextInput
            multiline={true}
            placeholder={i18n.t('SCREEN.PLAN.MEMO_PLACEHOLDER')}
            placeholderTextColor="gray"
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => setMemo(text)}
            editable={!isLoading}
            autoCapitalize="none"
          />
        </View>

        <Text className="text-lg font-bold text-light-text dark:text-dark-text">
          {i18n.t('SCREEN.PLAN.ADD_FRIEND')}
        </Text>
        <Button
          theme="info"
          text={i18n.t('SCREEN.PLAN.SELECT')}
          onPress={() => alert(i18n.t('SCREEN.PLAN.PREPARING'))}
          disabled={isLoading}
          loading={isLoading}
        />
        <Button
          theme="theme"
          text={i18n.t('SCREEN.PLAN.REGISTER')}
          onPress={handlerSubmit}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </BackgroundView>
  );
}
