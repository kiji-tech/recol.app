import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import PlaceCard from '@/src/features/map/components/Place/PlaceCard';
import { Text, View } from 'react-native';
import { Place } from '@/src/features/map/types/Place';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { ScrollResponderMixin } from 'react-native';
import { useMap } from '../../hooks/useMap';
import { isIOS } from 'toastify-react-native/utils/helpers';
import i18n from '@/src/libs/i18n';
import { Loading } from '@/src/components';

type Props = {
  onSelectedPlace: (place: Place) => void;
};
const MapBottomSheetBody = forwardRef(
  ({ onSelectedPlace }: Props, ref: ForwardedRef<BottomSheetScrollViewMethods>) => {
    // ==== Member ====
    const { searchPlaceList, isSearchLoading, selectedPlace, selectedPlaceList, selectedCategory } =
      useMap();
    console.log({ isSearchLoading });
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
    if (isSearchLoading) return <Loading />;
    return (
      <BottomSheetScrollView className="w-full flex-1" ref={scrollRef}>
        {!isSearchLoading && searchPlaceList && searchPlaceList.length == 0 && (
          <View className="w-full p-8">
            <Text className="text-center text-light-text dark:text-dark-text">
              {selectedCategory == 'selected'
                ? i18n.t('SCREEN.MAP.NO_SELECTED')
                : i18n.t('SCREEN.MAP.NO_RESULT')}
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
