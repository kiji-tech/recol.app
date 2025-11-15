import React, { useCallback, useState } from 'react';
import { Button, Header, Loading } from '@/src/components';
import { BackgroundView } from '@/src/components';
import { borderColor } from '@/src/themes/ColorUtil';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput } from 'react-native';
import { updatePlan } from '@/src/features/plan/apis/updatePlan';
import { fetchPlan, Plan } from '@/src/features/plan';
import { useAuth } from '@/src/features/auth';
import * as Location from 'expo-location';
import { useMutation, useQuery } from 'react-query';
import i18n from '@/src/libs/i18n';
import { Toast } from 'toastify-react-native';

export default function PlanEditor() {
  // === Member ===
  const router = useRouter();
  const { uid: planId } = useLocalSearchParams<{ uid: string }>();
  const { session } = useAuth();
  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', planId],
    queryFn: () => fetchPlan(planId, session),
  });
  const [editPlan, setEditPlan] = useState<Plan | null>(plan!);
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
    mutation.mutate(editPlan!);
  };

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      if (plan) {
        setEditPlan(plan);
      }
    }, [plan])
  );

  // === Render ===
  if (isLoading || !editPlan) {
    return <Loading />;
  }
  return (
    <BackgroundView>
      <Header
        title={`${editPlan?.title || i18n.t('SCREEN.PLAN.NEW_PLAN')}${i18n.t('SCREEN.PLAN.EDIT_TITLE')}`}
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
          value={editPlan?.title || ''}
          placeholder={i18n.t('SCREEN.PLAN.TITLE_PLACEHOLDER')}
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={(text) => setEditPlan({ ...editPlan, title: text } as Plan)}
        />
        <View className="w-full flex flex-col justify-start items-start">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            {i18n.t('SCREEN.PLAN.MEMO_LABEL')}
          </Text>
          <TextInput
            value={editPlan?.memo || ''}
            multiline={true}
            placeholder={i18n.t('SCREEN.PLAN.MEMO_PLACEHOLDER')}
            placeholderTextColor="gray"
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => setEditPlan({ ...editPlan, memo: text } as Plan)}
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
        />
        <Button theme="theme" text={i18n.t('SCREEN.PLAN.REGISTER')} onPress={handlerSubmit} />
      </View>
    </BackgroundView>
  );
}
