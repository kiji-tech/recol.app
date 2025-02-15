import React, { useState } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateProfile } from '@/src/libs/ApiService';
import { Tables } from '@/src/libs/database.types';
import { LogUtil } from '@/src/libs/LogUtil';

export default function ProfileEditorScreen() {
  // === Member ===
  const router = useRouter();
  const { session, user, profile, setProfile } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(profile?.avatar_url ?? null);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');

  // === Method ===
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const newProfile = await updateProfile(displayName, avatar, session).catch((err) => {
      console.error(err);
    });
    LogUtil.log(newProfile, {});
    setProfile(newProfile as Tables<'profile'> | null);
    router.back();
  };

  // === Render ===
  return (
    <BackgroundView>
      <Header title="プロフィール編集" onBack={() => router.back()} />
      <View className="p-4 flex flex-col gap-6">
        <View className="items-center">
          <TouchableOpacity onPress={handlePickImage} className="relative">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border dark:border-dark-border">
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full bg-light-shadow dark:bg-dark-shadow items-center justify-center">
                  <Ionicons name="person" size={40} color="#666666" />
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-light-theme dark:bg-dark-theme rounded-full p-2">
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-base font-bold mb-2 text-light-text dark:text-dark-text">
            メールアドレス
          </Text>
          <TextInput
            className="border border-light-border dark:border-dark-border rounded-lg p-3 text-base text-light-text dark:text-dark-text bg-light-shadow dark:bg-dark-shadow"
            value={user?.email || 'not found'}
            editable={false}
          />
        </View>

        <View>
          <Text className="text-base font-bold mb-2 text-light-text dark:text-dark-text">
            表示名
          </Text>
          <TextInput
            className="border border-light-border dark:border-dark-border rounded-lg p-3 text-base text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="表示名を入力"
            placeholderTextColor="gray"
          />
        </View>

        <Button onPress={handleSave} text="保存" theme="theme" />
      </View>
    </BackgroundView>
  );
}
