import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, TextInput, View } from 'react-native';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleResetPassword = () => {
    if (password !== password2) {
      Alert.alert('パスワードが一致しません');
      return;
    }
  };

  return (
    <BackgroundView>
      <Text>ResetPassword</Text>
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
