import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import { Text, View } from 'react-native';
import { Place, PlaceCard, useMap } from '@/src/features/map';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { ScrollResponderMixin } from 'react-native';
import { isIOS } from 'toastify-react-native/utils/helpers';
import { Loading } from '@/src/components';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  onSelectedPlace: (place: Place) => void;
};
const MapBottomSheetBody = forwardRef(
  ({ onSelectedPlace }: Props, ref: ForwardedRef<BottomSheetScrollViewMethods>) => {
    // ==== Member ====
    const {
      searchPlaceList,
      isSearchLoading,
      isLoadingSelectedPlaceList,
      selectedPlace,
      selectedPlaceList,
      selectedCategory,
    } = useMap();
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
    if (isSearchLoading || isLoadingSelectedPlaceList) return <Loading />;
    return (
      <BottomSheetScrollView className="w-full flex-1" ref={scrollRef}>
        {!isSearchLoading && searchPlaceList && searchPlaceList.length == 0 && (
          <View className="w-full p-8">
            <Text className="text-center text-light-text dark:text-dark-text">
              {selectedCategory == 'selected'
                ? generateI18nMessage('FEATURE.MAP.NO_SELECTED')
                : generateI18nMessage('FEATURE.MAP.NO_RESULT')}
            </Text>
          </View>
        )}
        {selectedCategory != 'selected' &&
          searchPlaceList &&
          searchPlaceList.map((place: Place) => (
            <PlaceCard
              key={place.id}
              place={place}
              selected={selectedPlace ? selectedPlace.id === place.id : false}
              onSelect={() => onSelectedPlace(place)}
            />
          ))}
        {selectedCategory == 'selected' &&
          selectedPlaceList.map((place: Place) => (
            <PlaceCard
              key={place.id}
              place={place}
              selected={selectedPlace ? selectedPlace.id === place.id : false}
              onSelect={() => onSelectedPlace(place)}
            />
          ))}
        {/* iOSの場合、ボトムシートの下部に余白を追加 ここだけモーダルなので余白が必要 */}
        {isIOS && <View className="w-full h-8" />}
      </BottomSheetScrollView>
    );
  }
);

MapBottomSheetBody.displayName = 'MapBottomSheetBody';

export default MapBottomSheetBody;
