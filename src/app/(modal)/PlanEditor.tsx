import React, { useState } from 'react';
import { Button, Header, Loading,BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useRouter } from 'expo-router';
import { View, Text, TextInput } from 'react-native';
import { updatePlan } from '@/src/features/plan/apis/updatePlan';
import { Plan } from '@/src/features/plan';
import { useAuth } from '@/src/features/auth';
import * as Location from 'expo-location';
import { useMutation } from 'react-query';
import generateI18nMessage from '@/src/libs/i18n';
import { Toast } from 'toastify-react-native';
import { LogUtil } from '@/src/libs/LogUtil';
import { usePlan } from '@/src/contexts/PlanContext';

export default function PlanEditor() {
  // === Member ===
  const router = useRouter();
  const { session, user } = useAuth();
  const { plan, planLoading, planId } = usePlan();
  const [title, setTitle] = useState<string>(plan?.title || '');
  const [memo, setMemo] = useState<string>(plan?.memo || '');

  const mutation = useMutation({
    mutationFn: (newPlan: Plan) => updatePlan(newPlan, session),
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
  /** 登録 */
  const handlerSubmit = async () => {
    LogUtil.log(JSON.stringify({ handlerSubmit: { title, memo } }), { user, level: 'info' });
    mutation.mutate({
      ...plan,
      title,
      memo,
    } as Plan);
  };

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // === Render ===
  if (planLoading || plan?.uid !== planId) {
    return <Loading />;
  }
  return (
    <BackgroundView>
      <Header
        title={`${plan?.title || generateI18nMessage('FEATURE.PLAN.NEW_PLAN')}${generateI18nMessage('FEATURE.PLAN.EDIT_TITLE')}`}
        onBack={() => {
          router.back();
        }}
      />
      {/* タイトル */}
      <View className="w-full flex flex-col justify-start items-start gap-4">
        <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
          {generateI18nMessage('FEATURE.PLAN.TITLE_LABEL')}
        </Text>
        <TextInput
          value={title}
          placeholder={generateI18nMessage('FEATURE.PLAN.TITLE_PLACEHOLDER')}
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={(text) => setTitle(text)}
        />
        <View className="w-full flex flex-col justify-start items-start">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            {generateI18nMessage('FEATURE.PLAN.MEMO_LABEL')}
          </Text>
          <TextInput
            value={memo}
            multiline={true}
            placeholder={generateI18nMessage('FEATURE.PLAN.MEMO_PLACEHOLDER')}
            placeholderTextColor="gray"
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => setMemo(text)}
            autoCapitalize="none"
          />
        </View>
        <Text className="text-lg font-bold text-light-text dark:text-dark-text">
          {generateI18nMessage('FEATURE.PLAN.ADD_FRIEND')}
        </Text>
        <Button
          theme="info"
          text={generateI18nMessage('FEATURE.PLAN.SELECT')}
          onPress={() => alert(generateI18nMessage('FEATURE.PLAN.PREPARING'))}
        />
        <Button
          theme="theme"
          text={generateI18nMessage('FEATURE.PLAN.REGISTER')}
          onPress={handlerSubmit}
        />
      </View>
    </BackgroundView>
  );
}
