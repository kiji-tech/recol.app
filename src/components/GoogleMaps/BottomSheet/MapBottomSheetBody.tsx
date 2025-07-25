import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import PlaceCard from './PlaceCard';
import { ActivityIndicator, Text, View } from 'react-native';
import { Place } from '@/src/entities/Place';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { ScrollResponderMixin } from 'react-native';
import { MapCategory } from '@/src/entities/MapCategory';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Platform } from 'react-native';

type Props = {
  placeList: Place[];
  selectedPlace: Place | null;
  selectedCategory: MapCategory;
  isLoading: boolean;
  onSelect: (place: Place) => void;
};
const MapBottomSheetBody = forwardRef(
  (
    { placeList, selectedPlace, onSelect, selectedCategory, isLoading }: Props,
    ref: ForwardedRef<BottomSheetScrollViewMethods>
  ) => {
    // ==== Member ====
    const { isDarkMode } = useTheme();
    const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
    if (ref) {
      useImperativeHandle(ref, () => ({
        scrollTo: (
          y: number | { x?: number; y?: number; animated?: boolean },
          x?: number,
          animated?: boolean
        ) => {
          scrollRef.current?.scrollTo(y, x, animated);
        },
        scrollToEnd: (options?: { animated: boolean }) => {
          scrollRef.current?.scrollToEnd(options);
        },
        getScrollResponder: () =>
          scrollRef.current?.getScrollResponder() || ({} as ScrollResponderMixin),
        getScrollableNode: () => scrollRef.current?.getScrollableNode() || 0,
        getInnerViewNode: () => scrollRef.current?.getInnerViewNode() || 0,
        setNativeProps: (props: object) => scrollRef.current?.setNativeProps(props),
      }));
    }

    // ==== Method ====

    // ==== Render ====
    return (
      <>
        <BottomSheetScrollView className="w-full flex-1" ref={scrollRef}>
          {isLoading && (
            <View className="w-full p-8">
              <ActivityIndicator color={isDarkMode ? 'white' : 'black'} />
            </View>
          )}
          {!isLoading && placeList && placeList.length == 0 && (
            <View className="w-full p-8">
              <Text className="text-center text-light-text dark:text-dark-text">
                {selectedCategory == 'selected'
                  ? '候補が選択されていません'
                  : '検索結果がありません'}
              </Text>
            </View>
          )}
          {placeList &&
            placeList.map((place: Place) => (
              <PlaceCard
                key={place.id}
                place={place}
                selected={selectedPlace ? selectedPlace.id === place.id : false}
                onSelect={onSelect}
              />
            ))}
          {/* アクションバーで隠れるため高くする */}
          <View className={Platform.OS === 'ios' ? 'h-[20px]' : 'h-[30px]'}></View>
        </BottomSheetScrollView>
      </>
    );
  }
);

MapBottomSheetBody.displayName = 'MapBottomSheetBody';

export default MapBottomSheetBody;
