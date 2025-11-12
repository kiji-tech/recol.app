import React from 'react';
import { Button, Header } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Alert } from 'react-native';
import { useAuth } from '@/src/features/auth';
import { usePlan } from '@/src/contexts/PlanContext';
import { updatePlan } from '@/src/features/plan/apis/updatePlan';
import { Plan } from '@/src/features/plan';
import * as Location from 'expo-location';
import i18n from '@/src/libs/i18n';

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
        if (e && e.message) {
          Alert.alert(e.message);
        }
      });
  };

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // === Render ===
  if (!plan) {
    Alert.alert(i18n.t('SCREEN.PLAN.PLAN_NOT_FOUND'));
    router.back();
  }

  return (
    <BackgroundView>
      <Header
        title={`${plan?.title || i18n.t('SCREEN.PLAN.NEW_PLAN')}${i18n.t('SCREEN.PLAN.EDIT_TITLE')}`}
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
          value={plan?.title || ''}
          placeholder={i18n.t('SCREEN.PLAN.TITLE_PLACEHOLDER')}
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={(text) => setPlan({ ...plan, title: text } as Plan)}
        />
        <View className="w-full flex flex-col justify-start items-start">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            {i18n.t('SCREEN.PLAN.MEMO_LABEL')}
          </Text>
          <TextInput
            value={plan?.memo || ''}
            multiline={true}
            placeholder={i18n.t('SCREEN.PLAN.MEMO_PLACEHOLDER')}
            placeholderTextColor="gray"
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => setPlan({ ...plan, memo: text } as Plan)}
            autoCapitalize="none"
          />
        </View>
        <Text className="text-lg font-bold text-light-text dark:text-dark-text">
          {i18n.t('SCREEN.PLAN.ADD_FRIEND')}
        </Text>
        <Button theme="info" text={i18n.t('SCREEN.PLAN.SELECT')} onPress={() => alert(i18n.t('SCREEN.PLAN.PREPARING'))} />
        <Button theme="theme" text={i18n.t('SCREEN.PLAN.REGISTER')} onPress={handlerSubmit} />
      </View>
    </BackgroundView>
  );
}
