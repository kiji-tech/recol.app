import React, { useMemo, useState } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/features/auth';
import { updateProfile } from '@/src/features/profile';
import * as ImagePicker from 'expo-image-picker';
import { Profile } from '@/src/features/profile/types/Profile';
import generateI18nMessage from '@/src/libs/i18n';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { fetchProfile } from '@/src/features/profile';

export default function ProfileEditorScreen() {
  // === Member ===
  const router = useRouter();
  const { session, user, setProfile } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(session),
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: (profile: Profile) => updateProfile(profile, session),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        Toast.warn(error.message);
      }
    },
  });
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const avatarUrl = useMemo(
    () =>
      profile?.avatar_url
        ? `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${profile?.avatar_url}`
        : null,
    [profile]
  );
  const [avatar, setAvatar] = useState<string | null>(avatarUrl);

  // === Method ===
  /**
   * 画像選択処理
   * @returns void
   */
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
   * @returns void
   */
  const handleSave = async () => {
    if (!profile) return;
    let base64Image: string | null = avatarUrl;
    if (base64Image != avatar) {
      base64Image = avatar
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
    }
    profile.display_name = displayName;
    profile.avatar_url = base64Image || null;
    setProfile(new Profile(profile));
    mutate(profile);
  };

  // === Render ===
  return (
    <BackgroundView>
      <Header
        title={generateI18nMessage('FEATURE.PROFILE.EDIT_TITLE')}
        onBack={() => router.back()}
      />
      <View className="p-4 flex flex-col gap-6">
        <View className="items-center">
          <TouchableOpacity onPress={handlePickImage} className="relative">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border dark:border-dark-border">
              {avatar ? (
                <Image
                  cachePolicy="memory-disk"
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
            {generateI18nMessage('FEATURE.PROFILE.EMAIL_LABEL')}
          </Text>
          <TextInput
            className="border border-light-border dark:border-dark-border rounded-lg p-3 text-base text-light-text dark:text-dark-text bg-light-shadow dark:bg-dark-shadow"
            value={user?.email || generateI18nMessage('FEATURE.PROFILE.NOT_FOUND')}
            editable={false}
          />
        </View>

        <View>
          <Text className="text-base font-bold mb-2 text-light-text dark:text-dark-text">
            {generateI18nMessage('FEATURE.PROFILE.DISPLAY_NAME_LABEL')}
          </Text>
          <TextInput
            className="border border-light-border dark:border-dark-border rounded-lg p-3 text-base text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={generateI18nMessage('FEATURE.PROFILE.DISPLAY_NAME_PLACEHOLDER')}
            placeholderTextColor="gray"
            editable={!isLoading}
          />
        </View>

        <Button
          onPress={handleSave}
          text={generateI18nMessage('FEATURE.PROFILE.SAVE')}
          theme="theme"
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </BackgroundView>
  );
}
