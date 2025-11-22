import { BackgroundView, Header, Button } from '@/src/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { deleteAccount } from '@/src/features/auth';
import { useAuth } from '@/src/features/auth';
import { useSlackNotification } from '@/src/features/slack/hooks/useSlackNotification';
import { usePremiumPlan } from '@/src/features/auth/hooks/usePremiumPlan';
import { Linking } from 'react-native';
import generateI18nMessage from '@/src/libs/i18n';
import { useMutation } from 'react-query';
import { Toast } from 'toastify-react-native';

interface ConsentItem {
  id: string;
  text: string;
  checked: boolean;
}

export default function RemoveAccount() {
  const router = useRouter();
  const { activePlanId, managementURL, onRefetch } = usePremiumPlan();
  const { sendNotification } = useSlackNotification();
  const { theme } = useTheme();
  const { logout, session } = useAuth();
  const [consentItems, setConsentItems] = useState<ConsentItem[]>([
    {
      id: 'subscription_cancel',
      text: generateI18nMessage('SCREEN.ACCOUNT.SUBSCRIPTION_CANCELED'),
      checked: false,
    },
    {
      id: 'premium_refund',
      text: generateI18nMessage('SCREEN.ACCOUNT.NO_REFUND'),
      checked: false,
    },
    {
      id: 'plan_restore',
      text: generateI18nMessage('SCREEN.ACCOUNT.NO_RESTORE'),
      checked: false,
    },
  ]);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => deleteAccount(session),
    onSuccess: () => {
      Alert.alert(
        generateI18nMessage('SCREEN.ACCOUNT.DELETE_SUCCESS_TITLE'),
        generateI18nMessage('SCREEN.ACCOUNT.DELETE_SUCCESS_MESSAGE'),
        [
          {
            text: generateI18nMessage('COMMON.OK'),
            onPress: async () => {
              await sendNotification({
                message: `アカウント削除完了: ${session?.user.email}`,
                type: 'delete-account',
              });
              await logout();
              router.replace('/(auth)/SignIn');
            },
          },
        ]
      );
    },
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        Toast.error(error.message);
      }
    },
  });

  const isDarkMode = theme === 'dark';
  const allItemsChecked = consentItems.every((item) => item.checked);

  // チェックボックスの状態を切り替え
  const toggleConsent = (id: string) => {
    setConsentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // アカウント削除処理
  const handleDeleteAccount = async () => {
    Alert.alert(
      generateI18nMessage('SCREEN.ACCOUNT.DELETE_CONFIRM_TITLE'),
      generateI18nMessage('SCREEN.ACCOUNT.DELETE_CONFIRM_MESSAGE'),
      [
        {
          text: generateI18nMessage('COMMON.CANCEL'),
          style: 'cancel',
        },
        {
          text: generateI18nMessage('COMMON.DELETE'),
          style: 'destructive',
          onPress: async () => {
            try {
              mutate();
            } catch (error) {
              Alert.alert(
                generateI18nMessage('COMMON.ERROR'),
                error instanceof Error
                  ? error.message
                  : generateI18nMessage('SCREEN.ACCOUNT.DELETE_FAILED')
              );
            }
          },
        },
      ]
    );
  };

  return (
    <BackgroundView>
      <Header
        title={generateI18nMessage('SCREEN.ACCOUNT.DELETE_TITLE')}
        onBack={() => router.back()}
      />

      <View className="flex-1 px-6 py-8">
        {/* 警告メッセージ */}
        <View className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={20} color={isDarkMode ? '#fca5a5' : '#dc2626'} />
            <Text className="ml-2 text-red-600 dark:text-red-400 font-bold text-base">
              {generateI18nMessage('SCREEN.ACCOUNT.IMPORTANT_NOTICE')}
            </Text>
          </View>
          <Text className="text-red-700 dark:text-red-300 text-sm leading-6">
            {generateI18nMessage('SCREEN.ACCOUNT.DELETE_WARNING')}
          </Text>
        </View>

        {/* プレミアムプランの解約案内 */}
        {activePlanId && (
          <View className="mb-8">
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
              {generateI18nMessage('SCREEN.ACCOUNT.PREMIUM_CANCEL_GUIDE')}
            </Text>
            <Text className="text-sm text-light-text dark:text-dark-text">
              {generateI18nMessage('SCREEN.ACCOUNT.PREMIUM_NOT_AUTO_CANCEL')}
              <Text
                onPress={() => {
                  Linking.openURL(managementURL || '').then(async () => {
                    await onRefetch();
                  });
                }}
                className="text-sm text-blue-500"
              >
                {generateI18nMessage('SCREEN.ACCOUNT.CHECK_HERE')}
              </Text>
              {generateI18nMessage('SCREEN.ACCOUNT.CHECK_PURCHASE')}
            </Text>
          </View>
        )}

        {/* 同意項目 */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            {generateI18nMessage('SCREEN.ACCOUNT.DELETE_CONSENT')}
          </Text>
          {consentItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleConsent(item.id)}
              className="flex-row items-center py-4 px-4 mb-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border"
            >
              <View className="mr-2">
                <Ionicons
                  name={item.checked ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={
                    item.checked
                      ? isDarkMode
                        ? '#3b82f6'
                        : '#2563eb'
                      : isDarkMode
                        ? '#6b7280'
                        : '#9ca3af'
                  }
                />
              </View>
              <Text className="flex-1 text-light-text dark:text-dark-text text-sm leading-6">
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 削除ボタン */}
        <View className="mt-auto">
          <Button
            text={generateI18nMessage('SCREEN.ACCOUNT.DELETE_BUTTON')}
            onPress={handleDeleteAccount}
            theme="danger"
            disabled={!allItemsChecked || isLoading}
            loading={isLoading}
          />

          <Text className="text-center text-xs text-light-text dark:text-dark-text mt-4 opacity-70">
            {generateI18nMessage('SCREEN.ACCOUNT.ENABLE_DELETE')}
          </Text>
        </View>
      </View>
    </BackgroundView>
  );
}
