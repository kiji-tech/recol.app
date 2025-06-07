import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Header, IconButton } from '@/src/components';
import { useFocusEffect, useRouter } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import BackgroundView from '@/src/components/BackgroundView';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native-gesture-handler';
import { deletePlanMedias, fetchPlanMediaList, uploadPlanMedias } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Tables } from '@/src/libs/database.types';

export default function MediaScreen() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { plan } = usePlan();
  const { session } = useAuth();
  const [images, setImages] = useState<Tables<'media'>[]>([]);
  const [selectedImages, setSelectedImages] = useState<Tables<'media'>[]>([]);
  const [mode, setMode] = useState<'normal' | 'select'>('normal');

  // === Method ===
  const fetchImages = useCallback(async () => {
    if (plan) {
      fetchPlanMediaList(plan.uid!, session).then((data) => {
        setImages(data);
      });
    }
  }, [plan, session]);
  const handlePressImage = (item: Tables<'media'>) => {
    if (mode === 'normal') {
      // ポップアップ（全画面表示）
    } else {
      // 選択モード →  画像の選択
      let updateImages = [];
      if (selectedImages.some((image) => image.uid === item.uid)) {
        // すでに選択されている場合は削除
        updateImages = selectedImages.filter((image) => image.url !== item.url);
      } else {
        // 選択されていない場合は追加
        updateImages = [...selectedImages, item];
      }
      setSelectedImages(updateImages);
      if (updateImages.length === 0) {
        setMode('normal');
      }
      console.log({ updateImages });
    }
  };
  const handleLongPressImage = (item: Tables<'media'>) => {
    // 選択モード → 削除
    if (mode == 'normal') {
      setMode('select');
      setSelectedImages([item]);
    }
  };

  /**
   * 画像を追加・アップロード
   */
  const handleAddImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
      base64: true,
    });

    if (result.canceled) {
      return;
    }
    const images = result.assets.map((a) => a.uri);
    const uploadImages = [];
    for (const image of images) {
      const base64Image = image
        ? await fetch(image)
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
      if (base64Image) {
        uploadImages.push(base64Image);
      }
    }

    // データのアップロード
    await uploadPlanMedias(plan!.uid!, uploadImages, session).then(() => {
      // 画像一覧を更新
      fetchImages();
    });
  };

  const handleDeleteImages = async () => {
    await deletePlanMedias(
      plan!.uid!,
      selectedImages.map((item) => item.uid!),
      session
    ).then(() => {
      // 画像一覧を更新
      fetchImages();
    });
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      if (plan) {
        fetchImages();
      }
    }, [plan, session])
  );

  // === Render ===

  return (
    <BackgroundView>
      <Header title="メディア" onBack={() => router.back()} />
      {/* イメージビュー */}
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item) => `media-${item.uid}`}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              className="aspect-square w-1/3 border border-light-border dark:border-dark-border"
              onPress={() => handlePressImage(item)}
              onLongPress={() => {
                handleLongPressImage(item);
              }}
            >
              {mode == 'select' && selectedImages.some((image) => image.uid === item.uid) && (
                <View className="absolute z-50 top-0 right-0 w-6 h-6 bg-light-danger flex justify-center items-center rounded-full ">
                  <AntDesign name="check" size={12} color="white" />
                </View>
              )}
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${item.url}`,
                }}
                className="w-full h-full"
              />
            </TouchableOpacity>
          );
        }}
      />
      <View className="absolute bottom-16 right-4">
        {mode === 'select' && (
          <IconButton
            icon={<AntDesign name="delete" size={24} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleDeleteImages}
            theme="danger"
          />
        )}
        {mode === 'normal' && (
          <IconButton
            icon={<AntDesign name="plus" size={24} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleAddImages}
          />
        )}
      </View>
    </BackgroundView>
  );
}
