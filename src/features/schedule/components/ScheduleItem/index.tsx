import React, { useState } from 'react';
import { Toast } from 'toastify-react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  Schedule,
  isTargetTime,
  CategoryIcon,
  ScheduleItemMenu,
  PostsScheduleSelectModal,
  MediaViewer,
} from '@/src/features/schedule';
import { useTheme } from '@/src/contexts';
import { openUrl } from '@/src/features/article/libs/openBrowser';
import { Place } from '@/src/features/map';
import { PostPlaceModal } from '@/src/features/posts';
import Autolink from 'react-native-autolink';
import generateI18nMessage from '@/src/libs/i18n';
import dayjs from 'dayjs';

type Props = {
  item: Schedule;
  isEndDateView: boolean;
  onPress: (schedule: Schedule) => void;
  onLongPress: (schedule: Schedule) => void;
};
export default function ScheduleItem({ item, isEndDateView, onPress, onLongPress }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [isPostsSelectModalVisible, setIsPostsSelectModalVisible] = useState(false);
  const [isPostsPlaceModalVisible, setIsPostsPlaceModalVisible] = useState(false);
  const [postsPlace, setPostsPlace] = useState<Place | null>(null);
  // === Handler ===
  const handlePostsSelect = (place: Place) => {
    setPostsPlace(place);
    setIsPostsSelectModalVisible(false);
    setIsPostsPlaceModalVisible(true);
  };
  const handlePostsPlaceModalClose = () => {
    setPostsPlace(null);
    setIsPostsPlaceModalVisible(false);
  };
  const handlePostsSelectModal = () => {
    console.log('handlePostsSelectModal', item.place_list);
    if (!item.place_list || item.place_list.length === 0) {
      Toast.warn(generateI18nMessage('FEATURE.SCHEDULE.NOT_FOUND_PLACE'));
      return;
    }
    setIsPostsSelectModalVisible(true);
  };
  const handlePostsSelectModalClose = () => {
    setIsPostsSelectModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onLongPress(item)}>
        <View className="flex flex-col gap-2 px-4 pt-4">
          {/* 開始時刻 */}
          <View className="flex flex-row gap-2 items-center justify-between">
            <View className="flex flex-row gap-2 items-center justify-start">
              <CategoryIcon schedule={item} isDarkMode={isDarkMode} />
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                {dayjs(item.from).format('H:mm')}
              </Text>
              <Text className="font-normal text-2xl text-light-text dark:text-dark-text">
                {item.title}
              </Text>
            </View>
            <ScheduleItemMenu
              schedule={item}
              onPosts={handlePostsSelectModal}
              onDelete={() => onLongPress(item)}
            />
          </View>
          {/* 情報詳細 */}
          <View
            className="flex flex-col gap-2 p-4 ml-4 border-light-border dark:border-dark-border"
            style={{ borderLeftWidth: 1 }}
          >
            <View className="flex flex-row justify-between">
              {/* メモ */}
              <View className="flex-1">
                <Autolink
                  text={item.description || ''}
                  linkStyle={{
                    color: isDarkMode ? '#60a5fa' : '#2563eb',
                  }}
                  onPress={openUrl}
                  textProps={{
                    className: 'text-light-text dark:text-dark-text',
                  }}
                  numberOfLines={8}
                />
              </View>
              {/* メディア */}
              {item.media_list && item.media_list?.length > 0 && (
                <View className="w-1/3">
                  <MediaViewer
                    mediaUrlList={item.media_list
                      .map(
                        (media) =>
                          `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${media.url}` ||
                          ''
                      )
                      .filter((url) => url !== '')}
                  />
                </View>
              )}
            </View>
            <View className="flex flex-row justify-between">
              {/* TODO: チェックリスト（将来機能） */}
              {/* <Text className="text-light-text dark:text-dark-text">☑ 0/2 件</Text> */}
              {/* マップリスト */}
              {item.place_list && item.place_list?.length > 0 && (
                <View className="flex flex-row gap-2 items-center">
                  <FontAwesome5 name="map-marker-alt" size={18} color="#f87171" />
                  <Text className="text-lg text-light-text dark:text-dark-text">
                    {item.place_list.filter((place) => place !== null)?.length || 0}件
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* 終了時刻 */}
          {isEndDateView && (
            <View className="flex flex-row gap-2 items-center mb-4">
              <View
                className={`w-8 h-8 flex justify-center items-center rounded-full
                ${isTargetTime(item.from!, item.to!) === -1 && 'bg-light-border dark:bg-dark-border'}
                ${isTargetTime(item.from!, item.to!) === 0 && 'bg-light-danger dark:bg-dark-danger'}
                ${isTargetTime(item.from!, item.to!) === 1 && 'bg-light-info dark:bg-dark-info'}`}
              />
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                {dayjs(item.to).format('H:mm')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {isPostsSelectModalVisible && (
        <PostsScheduleSelectModal
          schedule={item}
          onSelect={handlePostsSelect}
          onClose={handlePostsSelectModalClose}
        />
      )}
      {isPostsPlaceModalVisible && postsPlace && (
        <PostPlaceModal place={postsPlace} onClose={handlePostsPlaceModalClose} />
      )}
    </>
  );
}
