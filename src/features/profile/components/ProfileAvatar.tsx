import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types/Profile';
import { User } from '@supabase/supabase-js';

type Props = {
  profile: Profile | null;
  user: User;
};
export default function ProfileAvatar({ profile, user }: Props) {
  return (
    <View className="items-center p-6 border-b border-light-border dark:border-dark-border">
      <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border dark:border-dark-border">
        {profile?.avatar_url ? (
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${profile?.avatar_url}`,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <View className="w-full h-full bg-light-shadow dark:bg-dark-shadow items-center justify-center">
            <Ionicons name="person" size={40} color="gray" />
          </View>
        )}
      </View>
      <Text className="text-xl font-bold text-light-text dark:text-dark-text">
        {profile?.display_name || 'ユーザー名未設定'}
      </Text>
      <Text className="text-light-text dark:text-dark-text">{user.email}</Text>
    </View>
  );
}
