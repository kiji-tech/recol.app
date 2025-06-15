import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';

export default function SubscriptionComplete() {
  const { fetchProfile } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      setTimeout(() => {
        router.replace('/(home)');
      }, 3000);
    }, [])
  );

  return (
    <View>
      <Text>SubscriptionComplete</Text>
    </View>
  );
}
