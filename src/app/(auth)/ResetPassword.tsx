import React, { useState } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { Alert, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ResetPassword() {
  const router = useRouter();
  const { updateUserPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleResetPassword = () => {
    if (password !== password2) {
      Alert.alert('パスワードが一致しません');
      return;
    }
    updateUserPassword(password)
      .then(() => {
        Alert.alert('パスワードを変更しました');
        router.navigate('/(home)');
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  return (
    <BackgroundView>
      <Header title="パスワードをリセット" />
      <View className="w-full flex flex-col gap-4">
        <TextInput
          placeholder="パスワード"
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          placeholder="パスワード（確認）"
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
          value={password2}
          secureTextEntry={true}
          onChangeText={(text) => setPassword2(text)}
        />

        {/* サインイン */}
        <Button theme={'theme'} text="パスワードを変更する" onPress={handleResetPassword} />
      </View>
    </BackgroundView>
  );
}
