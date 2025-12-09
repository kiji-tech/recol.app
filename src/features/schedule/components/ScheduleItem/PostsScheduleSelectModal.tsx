import React, { useEffect, useState } from 'react';
import { Schedule, MediaViewer } from '@/src/features/schedule';
import { Title, ModalLayout } from '@/src/components';
import { fetchCachePlace, Place, RateViewer } from '@/src/features/map';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { useAuth } from '@/src/features/auth';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  schedule: Schedule;
  onSelect: (place: Place) => void;
  onClose: () => void;
};
export default function PostsScheduleSelectModal({ schedule, onSelect, onClose }: Props) {
  // === Member ===
  const { session } = useAuth();
  const [placeList, setPlaceList] = useState<Place[]>([]);

  // === Effect ===
  useEffect(() => {
    const ctrl = new AbortController();
    fetchCachePlace(schedule.place_list!, session, ctrl).then((placeList) => {
      setPlaceList(placeList);
    });
    return () => ctrl.abort();
  }, [schedule]);

  // === Handler ===
  const handleOnSelect = (place: Place) => {
    onSelect(place);
  };
  const handleClose = () => {
    onClose();
  };

  // === Render ===
  return (
    <ModalLayout visible={true} onClose={handleClose} size="full">
      <Title text={generateI18nMessage('FEATURE.SCHEDULE.POSTS_PLACE_SELECT')} />
      <FlatList
        data={placeList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleOnSelect(item)}
            className="p-4 border-b border-light-border dark:border-dark-border flex flex-row gap-2 items-center justify-start"
          >
            <View className="w-1/4 mr-6">
              <MediaViewer
                mediaUrlList={item.photos
                  .slice(0, 3)
                  .map(
                    (photo) =>
                      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(photo.name)}`
                  )}
              />
            </View>
            <View className="flex-1 flex flex-col gap-2">
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                {item.displayName.text}
              </Text>
              <RateViewer rating={item.rating} />
              <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                {item.formattedAddress}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </ModalLayout>
  );
}
