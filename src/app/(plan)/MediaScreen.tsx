import React, { useCallback, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Platform,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { IconButton } from '@/src/components';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FlatList } from 'react-native-gesture-handler';
import { deletePlanMediaList, fetchPlanMediaList, uploadPlanMediaList } from '@/src/features/media';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { Media } from '@/src/features/media';
import MediaDetailModal from '@/src/features/media/components/MediaDetailModal';
import BackgroundView from '@/src/components/BackgroundView';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import MaskLoading from '@/src/components/MaskLoading';
import { usePlan } from '@/src/contexts/PlanContext';
import i18n from '@/src/libs/i18n';

export default function MediaScreen() {
  // === Member ===
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [mode, setMode] = useState<'normal' | 'select'>('normal');
  const [visibleImage, setVisibleImage] = useState<Media | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [addImage, setAddImage] = useState<string[]>([]);
  const { isDarkMode } = useTheme();
  const { session, user } = useAuth();
  const { planId } = usePlan();
  const {
    data: images,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['images', planId!],
    queryFn: () => fetchPlanMediaList(planId!, session),
  });

  const imageUploadMutation = useMutation({
    mutationFn: (images: string[]) => uploadPlanMediaList(planId!, images, session),
    onError: (error) => {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true, user });
      if (error && error instanceof Error && error.message) {
        Toast.warn(error.message);
      }
    },
  });

  const imageDeleteMutation = useMutation({
    mutationFn: (mediaIdList: string[]) => deletePlanMediaList(planId!, mediaIdList, session),
    onSuccess: () => {
      setSelectedImages([]);
      setMode('normal');
      refetch();
    },
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true, user });
        Toast.warn(error.message);
      }
    },
  });

  // === Method ===
  /**
   * 画像ビューを閉じる
   */
  const handleCloseImageView = () => {
    setVisibleImage(null);
  };

  /**
   * 画像を押した場合の処理
   * @param item {Media} 選択された画像
   */
  const handlePressImage = (item: Media) => {
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
   * @param item {Media} 選択された画像
   */
  const handleLongPressImage = (item: Media) => {
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
      quality: 0.75,
      allowsMultipleSelection: true,
      base64: true,
      presentationStyle:
        Platform.OS === 'android'
          ? ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC
          : undefined,
    });
    if (result.canceled) {
      return;
    }
    // 選択された画像のURIを取得
    const addImageList = result.assets.map((a) => a.uri);
    setAddImage(addImageList);
    setUploadedImage([]);
    for (const image of addImageList) {
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
                LogUtil.log(`fetch image error ${e.message}`, {
                  level: 'error',
                  notify: true,
                  user,
                });
              }
              return null;
            })
        : null;
      if (base64Image) {
        try {
          // データのアップロード
          await imageUploadMutation.mutateAsync([base64Image]);
          setUploadedImage((prev) => [...prev, base64Image]);
        } catch (error) {
          // エラーはmutationのonErrorで処理されるため、ここではログのみ
          LogUtil.log(`Upload failed for image: ${error}`, { level: 'error', user });
        }
      }
    }
    // アップロード完了後､アップロード中の画像リストをクリア
    setUploadedImage([]);
    setAddImage([]);
    // すべてのアップロード完了後にリフレッシュ
    refetch();
  };

  /**
   * 画像を削除
   */
  const handleDeleteImages = () => {
    imageDeleteMutation.mutate(selectedImages.map((item) => item.uid!));
  };

  // === Effect ===

  /**
   * バックボタンを押した場合は､モーダルを閉じるイベントハンドラを追加
   */
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  // === Render ===

  if (isFetching) {
    return <MaskLoading />;
  }

  /**  画像が選択された場合 */
  return (
    <SafeAreaView className="bg-light-background dark:bg-dark-background">
      {/* 画像が選択されていれば､モーダルが表示される */}
      <MediaDetailModal
        visible={visibleImage !== null}
        imageList={
          images?.map(
            (item) =>
              `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${item.url}`
          ) || []
        }
        selectedImage={
          visibleImage
            ? `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${visibleImage.url}`
            : null
        }
        onClose={handleCloseImageView}
      />
      {/* 画像が登録されていない場合 */}
      {images?.length === 0 && (
        <View className="flex justify-center items-center h-full">
          <Text className="text-light-text dark:text-dark-text text-xl">
            {i18n.t('SCREEN.MEDIA.NO_IMAGE_LIST')}
          </Text>
        </View>
      )}

      {/* 画像登録時のアニメーションバー  */}
      {addImage.length > 0 && (
        <View className={`absolute w-full z-50 ${Platform.OS === 'ios' ? 'top-20' : 'top-0'}`}>
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
              className="aspect-square w-1/3"
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
      <View className={`absolute bottom-8 right-4`}>
        {mode === 'select' && (
          <IconButton
            icon={<AntDesign name="delete" size={24} color={'white'} />}
            onPress={handleDeleteImages}
            theme="danger"
            disabled={isFetching}
            loading={isFetching}
          />
        )}
        {mode === 'normal' && (
          <IconButton
            icon={<AntDesign name="plus" size={24} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleAddImages}
            disabled={isFetching}
            loading={isFetching}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
