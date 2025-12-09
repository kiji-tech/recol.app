import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';
import generateI18nMessage from '@/src/libs/i18n';

export default function ForgetPassword() {
  const router = useRouter();
  const { resetPassword, user } = useAuth();
  const [email, setEmail] = useState('');
  const handleResetPassword = () => {
    resetPassword(email)
      .then(() => {
        Alert.alert(generateI18nMessage('FEATURE.AUTH.RESET_PASSWORD_SUCCESS'));
        router.navigate('/(auth)/SignIn');
      })
      .catch((error) => {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true, user });
        Alert.alert(generateI18nMessage('FEATURE.AUTH.RESET_PASSWORD_FAILED'));
      });
  };

  return (
    <BackgroundView>
      <Header title={generateI18nMessage('FEATURE.AUTH.RESET_PASSWORD_TITLE')} onBack={() => router.back()} />
      <View className="w-full flex flex-col gap-4">
        <TextInput
          keyboardType="email-address"
          placeholder={generateI18nMessage('FEATURE.AUTH.EMAIL_PLACEHOLDER')}
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
            text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
            `}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Button
          theme="theme"
          text={generateI18nMessage('FEATURE.AUTH.RESET_PASSWORD_BUTTON')}
          onPress={handleResetPassword}
        />
      </View>
    </BackgroundView>
  );
}
