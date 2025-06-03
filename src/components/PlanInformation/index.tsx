import React, { useState } from 'react';
import { Tables } from '@/src/libs/database.types';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@/src/contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

/**
 * プランインフォメーション
 * ・予定メモ
 * ・画像
 * ・メンバー
 */
export default function PlanInformation({ plan }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [images, setImages] = useState<string[]>([]);

  // === Method ===
  const handleAddImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
      base64: true,
    });

    if (!result.canceled) {
      setImages(result.assets.map((a) => a.uri));
    }
  };

  // === Render ===
  if (!plan) return <></>;

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-2xl font-bold text-light-text dark:text-dark-text">{plan.title}</Text>
      {/* 計画メモ */}
      <View className="px-2 py-4">
        <Text className="text-sm text-light-text dark:text-dark-text">
          {plan.memo || 'メモはありません.'}
        </Text>
      </View>
      {/* イメージビュー */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row gap-2">
          {images.map((image) => {
            return (
              <View
                key={image}
                className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md border border-light-border dark:border-dark-border"
              >
                <Image source={{ uri: image }} className="w-full h-full" />
              </View>
            );
          })}
          <TouchableOpacity
            onPress={handleAddImages}
            className="w-44 h-32 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
          >
            <View className="flex-1 justify-center items-center bg-light-background dark:bg-dark-background">
              <AntDesign name="plus" size={24} color={isDarkMode ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* メンバーリスト */}
      {/* 予定地 */}
    </View>
  );
}
