import React, { useState } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateProfile } from '@/src/libs/ApiService';
import { Tables } from '@/src/libs/database.types';
import { LogUtil } from '@/src/libs/LogUtil';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileEditorScreen() {
  // === Member ===
  const router = useRouter();
  const { session, user, getProfileInfo, setProfile } = useAuth();
  const profile = getProfileInfo();
  const [avatar, setAvatar] = useState<string | null>(
    profile?.avatar_url
      ? `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${profile?.avatar_url}`
      : null
  );
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');

  // === Method ===
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  /**
   * プロフィールを保存する
   */
  const handleSave = async () => {
    const base64Image = avatar
      ? await fetch(avatar)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          })
          .catch(() => {
            return null;
          })
      : null;

    updateProfile(
      {
        ...profile,
        display_name: displayName,
        avatar_url: base64Image || null,
      } as Tables<'profile'>,
      session
    )
      .then((profile: Tables<'profile'> & { subscription: Tables<'subscription'>[] }) => {
        LogUtil.log(profile, {});
        setProfile(profile);
        router.back();
      })
      .catch((e) => {
        if (e && e.message) {
          Alert.alert(e.message);
        }
      });
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
                <Image
                  source={{
                    uri: avatar,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
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
