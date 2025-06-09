import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

export default function ForgetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const handleResetPassword = () => {
    resetPassword(email)
      .then(() => {})
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  return (
    <BackgroundView>
      <Text className="text-4xl font-bold text-light-text dark:text-dark-text">ForgetPassword</Text>
      <View>
        <TextInput
          keyboardType="email-address"
          placeholder="メールアドレス..."
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
            text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
            `}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <Button text="パスワードをリセット" onPress={handleResetPassword} />
    </BackgroundView>
  );
}
