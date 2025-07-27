import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';

export default function ForgetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const handleResetPassword = () => {
    resetPassword(email)
      .then(() => {
        Alert.alert('パスワードをリセットするためのメールを送信しました。');
        router.navigate('/(auth)/SignIn');
      })
      .catch((error) => {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
        Alert.alert('パスワードをリセットするためのメールを送信できませんでした。');
      });
  };

  return (
    <BackgroundView>
      <Header title="パスワードをリセット" onBack={() => router.back()} />
      <View className="w-full flex flex-col gap-4">
        <TextInput
          keyboardType="email-address"
          placeholder="メールアドレス..."
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
            text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
            `}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Button theme="theme" text="パスワードをリセットする" onPress={handleResetPassword} />
      </View>
    </BackgroundView>
  );
}
