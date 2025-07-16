import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View, Text, Alert, Dimensions, Modal, Platform } from 'react-native';
import { Image } from 'expo-image';
import { IconButton } from '@/src/components';
import { useFocusEffect } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FlatList } from 'react-native-gesture-handler';
import { deletePlanMedias, fetchPlanMediaList, uploadPlanMedias } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Tables } from '@/src/libs/database.types';
import { LogUtil } from '@/src/libs/LogUtil';
import BackgroundView from '@/src/components/BackgroundView';
import AntDesign from '@expo/vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';

export default function MediaScreen() {
  // === Member ===
  const [images, setImages] = useState<Tables<'media'>[]>([]);
  const [selectedImages, setSelectedImages] = useState<Tables<'media'>[]>([]);
  const [mode, setMode] = useState<'normal' | 'select'>('normal');
  const [visibleImage, setVisibleImage] = useState<Tables<'media'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [addImage, setAddImage] = useState<string[]>([]);
  const { isDarkMode } = useTheme();
  const { plan } = usePlan();
  const { session } = useAuth();

  // === Method ===
  const fetchImages = useCallback(async () => {
    if (plan) {
      fetchPlanMediaList(plan.uid!, session)
        .then((data) => {
          setImages(data);
        })
        .catch((e) => {
          if (e && e.message) {
            Alert.alert(e.message);
          }
        });
    }
  }, [plan, session]);

  const handleCloseImageView = () => {
    setVisibleImage(null);
  };

  const handlePressImage = (item: Tables<'media'>) => {
    if (mode === 'normal') {
      // ポップアップ（全画面表示）
      setVisibleImage(item);
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
    }
  };

  /**
   * 画像を長押しした場合 選択モードに切り替える
   */
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
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.75,
      allowsMultipleSelection: true,
      base64: true,
    });
    if (result.canceled) {
      LogUtil.log('canceled', { level: 'info' });
      setIsLoading(false);
      return;
    }
    const images = result.assets.map((a) => a.uri);
    setAddImage(images);
    setUploadedImage([]);
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
            .catch((e) => {
              if (e && e.message) {
                LogUtil.log(`fetch image error ${e.message}`, { level: 'error', notify: true });
              }
              return null;
            })
        : null;
      if (base64Image) {
        // データのアップロード
        await uploadPlanMedias(plan!.uid!, [base64Image], session)
          .then(() => {
            // 画像一覧を更新
            fetchImages();
            setUploadedImage((prev) => [...prev, base64Image]);
          })
          .catch((e) => {
            if (e && e.message) {
              LogUtil.log(`upload image error ${e.message}`, { level: 'error', notify: true });
            }
          });
      }
    }
    setUploadedImage([]);
    setAddImage([]);
    setIsLoading(false);
  };

  const handleDeleteImages = () => {
    deletePlanMedias(
      plan!.uid!,
      selectedImages.map((item) => item.uid!),
      session
    )
      .then(() => {
        // 画像一覧を更新
        fetchImages();
        setSelectedImages([]);
        setMode('normal');
      })
      .catch((e) => {
        if (e && e.message) {
          Alert.alert(e.message);
        }
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
  /**  画像が選択された場合 */
  if (visibleImage) {
    return (
      <Modal visible={visibleImage != null} transparent={true}>
        <View className={`absolute ${Platform.OS === 'ios' ? 'top-28' : 'top-8'} left-4 z-50`}>
          <IconButton
            theme="background"
            icon={<AntDesign name="close" size={24} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleCloseImageView}
          />
        </View>
        <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-16' : ''}`}>
          <ImageViewer
            imageUrls={images.map((item) => ({
              url: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${item.url}`,
            }))}
            index={images.findIndex((item) => item.uid === visibleImage.uid)}
          />
        </View>
      </Modal>
    );
  }
  return (
    <BackgroundView>
      {images.length === 0 && (
        <View className="flex justify-center items-center h-full">
          <Text className="text-light-text dark:text-dark-text text-xl">
            メディアは登録されていません
          </Text>
        </View>
      )}
      {/* アニメーションバー  */}
      {addImage.length > 0 && (
        <View className="absolute top-20 w-full z-50">
          <Progress.Bar
            progress={uploadedImage.length / addImage.length}
            width={Dimensions.get('window').width}
            height={10}
            color={isDarkMode ? '#17AC38' : '#B5F3C3'}
            unfilledColor={isDarkMode ? '#5A5A5A' : '#D7D7D7'}
            borderWidth={0}
            borderRadius={0}
            style={{
              zIndex: 50,
            }}
          />
        </View>
      )}

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
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
      <View className={`absolute ${Platform.OS === 'ios' ? 'bottom-16' : 'bottom-8'} right-4`}>
        {mode === 'select' && (
          <IconButton
            icon={<AntDesign name="delete" size={24} color={'white'} />}
            onPress={handleDeleteImages}
            theme="danger"
            disabled={isLoading}
            loading={isLoading}
          />
        )}
        {mode === 'normal' && (
          <IconButton
            icon={<AntDesign name="plus" size={24} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleAddImages}
            disabled={isLoading}
            loading={isLoading}
          />
        )}
      </View>
    </BackgroundView>
  );
}
