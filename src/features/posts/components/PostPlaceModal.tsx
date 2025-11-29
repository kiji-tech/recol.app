import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Button, ModalLayout } from '@/src/components';
import { Place } from '@/src/features/map';
import PlaceCard from '../../map/components/Place/PlaceCard';
import { useTheme } from '@/src/contexts/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';
import useImagePicker from '@/src/features/media/hooks/useImagePicker';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import { useMutation } from 'react-query';
import { Toast } from 'toastify-react-native';
import { createPosts } from '../apis/createPosts';
import { useAuth } from '../../auth';
import { Posts } from '../types/Posts';

type Props = {
  place: Place;
  onClose: () => void;
};

export default function PostPlaceModal({ place, onClose }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { session } = useAuth();
  const { selectImageList, takePhoto, toBase64 } = useImagePicker();
  const [body, setBody] = useState('');
  const [mediaList, setMediaList] = useState<ImagePickerAsset[]>([]);

  // === Method ===

  //=== Handler ===
  /**
   * 戻る イベントハンドラ
   * @returns
   */
  const handleBack = () => {
    onClose();
  };

  /**
   * 投稿 イベントハンドラ
   * @returns
   */
  const handlePost = () => {
    console.log('Post:', { placeId: place.id, body, mediaList });
    mutate();
  };

  /**
   * フォルダーから画像を追加する
   * @returns
   */
  const handleAddImage = async () => {
    const remaining = 4 - mediaList.length;
    if (remaining <= 0) return;

    const result = await selectImageList({
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });

    if (result.length > 0) {
      setMediaList((prev) => [...prev, ...result].slice(0, 4));
    }
  };

  /**
   * カメラを起動して撮影した画像を追加する
   * @returns
   */
  const handleTakePhoto = async () => {
    const remaining = 4 - mediaList.length;
    if (remaining <= 0) return;

    const result = await takePhoto();

    if (result.length > 0) {
      setMediaList((prev) => [...prev, ...result].slice(0, 4));
    }
  };

  /**
   * 画像を削除する
   * @param index {number} 削除する画像のindex
   */
  const handleRemoveImage = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  // === Mutate ===
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const medias = [];
      for (const media of mediaList) {
        const mediaUrl = await toBase64(media.uri);
        if (mediaUrl) medias.push(mediaUrl);
      }
      const posts = new Posts({
        place_id: place.id,
        body,
        medias,
      } as Posts);

      await createPosts(posts, session);
    },
    onSuccess: () => {
      onClose();
    },
    onError: () => {
      Toast.warn('投稿に失敗しました');
    },
  });

  // === Render ===
  return (
    <ModalLayout
      visible={true}
      onClose={handleBack}
      size="full"
      rightComponent={
        <Button
          text="投稿"
          disabled={body.length === 0 || isLoading}
          loading={isLoading}
          theme="theme"
          size="fit"
          onPress={handlePost}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* 場所情報 */}
          <View className="mb-4 rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
            <PlaceCard place={place} selected={false} onSelect={() => {}} />
          </View>

          {/* 本文 & メディア追加ボタン */}
          <View className="mb-4 p-4 rounded-xl bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border">
            <TextInput
              className="text-lg text-light-text dark:text-dark-text min-h-[100px]"
              multiline
              placeholder="場所についての思い出を共有しましょう..."
              placeholderTextColor="gray"
              maxLength={255}
              value={body}
              onChangeText={setBody}
              textAlignVertical="top"
            />
            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-row gap-4">
                <TouchableOpacity onPress={handleTakePhoto} disabled={mediaList.length >= 4}>
                  <FontAwesome5
                    name="camera"
                    size={20}
                    color={mediaList.length >= 4 ? 'gray' : isDarkMode ? 'white' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddImage} disabled={mediaList.length >= 4}>
                  <FontAwesome5
                    name="images"
                    size={20}
                    color={mediaList.length >= 4 ? 'gray' : isDarkMode ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-right text-gray-500 text-sm">{body.length} / 255</Text>
            </View>
          </View>

          {/* メディア */}
          <FlatList
            data={mediaList || []}
            horizontal={true}
            contentContainerClassName="min-h-[100px] w-full gap-4"
            keyExtractor={(item: ImagePickerAsset, index: number) => `media-${index}`}
            renderItem={({ item, index }) => (
              <View className="h-full aspect-square">
                <Image
                  source={{ uri: item.uri }}
                  style={{ height: '100%', width: '100%', borderRadius: 16 }}
                  contentFit="cover"
                />
                <View className="absolute top-1 right-1">
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    className="bg-light-danger dark:bg-dark-danger rounded-full w-6 h-6 items-center justify-center shadow-sm"
                  >
                    <FontAwesome5 name="times" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalLayout>
  );
}
