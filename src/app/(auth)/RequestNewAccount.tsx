import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { resendConfirmationEmailLib } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import i18n from '@/src/libs/i18n';

/**
 * 新しいアカウントを作成するメールを送信した後の画面
 */
export default function RequestNewAccount() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const resendEmail = async () => {
    if (!email) {
      Alert.alert(i18n.t('COMMON.ERROR'), i18n.t('SCREEN.AUTH.EMAIL_NOT_FOUND'));
      return;
    }

    setIsLoading(true);
    LogUtil.log(`resendEmail: ${email}`, { level: 'info' });

    try {
      await resendConfirmationEmailLib(email);
      Alert.alert(i18n.t('COMMON.SUCCESS'), i18n.t('SCREEN.AUTH.RESEND_SUCCESS'));
    } catch (error: unknown) {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      Alert.alert(i18n.t('COMMON.ERROR'), i18n.t('SCREEN.AUTH.RESEND_FAILED'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8 ">
        <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
          {i18n.t('SCREEN.AUTH.REQUEST_NEW_ACCOUNT_TITLE')}
        </Text>
        {email && (
          <View className="w-full">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
              {i18n.t('SCREEN.AUTH.EMAIL_LABEL')}
            </Text>
            <View className="bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-xl p-4 w-full">
              <Text className="text-lg text-light-text dark:text-dark-text">{email}</Text>
            </View>
          </View>
        )}
        <Text className="text-lg text-light-text dark:text-dark-text">
          {i18n.t('SCREEN.AUTH.CHECK_EMAIL')}
        </Text>
        <Button
          theme="theme"
          text={i18n.t('SCREEN.AUTH.RESEND_EMAIL')}
          onPress={resendEmail}
          disabled={isLoading}
          loading={isLoading}
        />
        <Link href="/(auth)/SignIn">
          <Text className="text-lg text-light-text dark:text-dark-text">
            {i18n.t('SCREEN.AUTH.BACK_TO_SIGN_IN')}
          </Text>
        </Link>
      </View>
    </BackgroundView>
  );
}
