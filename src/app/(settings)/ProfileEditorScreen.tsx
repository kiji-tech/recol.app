import React, { useState } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/features/auth';
import { updateProfile } from '@/src/features/profile';
import * as ImagePicker from 'expo-image-picker';
import { Profile } from '@/src/features/profile/types/Profile';

export default function ProfileEditorScreen() {
  // === Member ===
  const { session, user, profile, setProfile } = useAuth();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(
    profile?.avatar_url
      ? `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${profile?.avatar_url}`
      : null
  );
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [isLoading, setIsLoading] = useState(false);

  // === Method ===
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      presentationStyle:
        Platform.OS === 'android'
          ? ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC
          : undefined,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  /**
   * プロフィールを保存する
   */
  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
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
      profile.display_name = displayName;
      profile.avatar_url = base64Image || null;
      setProfile(new Profile(profile));

      updateProfile(profile, session)
        .then((p: Profile) => {
          setProfile(new Profile(p));
          router.back();
        })
        .catch((e) => {
          if (e && e.message) {
            Alert.alert(e.message);
          }
        });
    } finally {
      setIsLoading(false);
    }
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
            editable={!isLoading}
          />
        </View>

        <Button
          onPress={handleSave}
          text="保存"
          theme="theme"
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </BackgroundView>
  );
}
